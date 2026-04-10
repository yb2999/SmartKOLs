"use client";

import { useState } from "react";
import { useMockStore, MonitoringMessage } from "@/lib/mock-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Bell, MessageCircle, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_CONFIG: Record<string, { label: string; variant: "collab" | "commerce" | "spam" | "secondary"; emoji: string }> = {
  collab:   { label: "合作邀约", variant: "collab",   emoji: "🤝" },
  commerce: { label: "商务询价", variant: "commerce", emoji: "💰" },
  spam:     { label: "垃圾信息", variant: "spam",     emoji: "🚨" },
  normal:   { label: "普通消息", variant: "secondary", emoji: "💬" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 24) return `${h}小时前`;
  return `${Math.floor(h / 24)}天前`;
}

export default function MonitoringPage() {
  const { monitoringMessages, markMessageRead } = useMockStore();
  const [selectedMsg, setSelectedMsg] = useState<MonitoringMessage | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"messages" | "alerts">("messages");

  // Alert config state
  const [larkWebhook, setLarkWebhook] = useState("");
  const [larkTrigger, setLarkTrigger] = useState("collab");
  const [larkEnabled, setLarkEnabled] = useState(false);
  const [tgToken, setTgToken] = useState("");
  const [tgChatId, setTgChatId] = useState("");
  const [tgTrigger, setTgTrigger] = useState("collab");
  const [tgEnabled, setTgEnabled] = useState(false);
  const [testing, setTesting] = useState<"lark" | "tg" | null>(null);
  const [testResult, setTestResult] = useState<"lark" | "tg" | null>(null);

  const filtered = monitoringMessages.filter((m) => filterCategory === "all" || m.category === filterCategory);
  const unreadCount = monitoringMessages.filter((m) => !m.read).length;

  const handleSelect = (msg: MonitoringMessage) => {
    setSelectedMsg(msg);
    markMessageRead(msg.id);
  };

  const handleTest = async (channel: "lark" | "tg") => {
    setTesting(channel);
    await new Promise((r) => setTimeout(r, 1500));
    setTesting(null);
    setTestResult(channel);
    setTimeout(() => setTestResult(null), 3000);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-8 py-5 border-b border-[#E8E8E8] flex items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111111] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#111111]" />
            监控中心
          </h1>
          <p className="text-[#999999] text-sm mt-0.5">自动识别私信类型，合作邀约即时报警</p>
        </div>
        {unreadCount > 0 && (
          <span className="ml-2 px-2.5 py-1 rounded-full bg-white text-[#111111] text-xs font-bold">{unreadCount} 条未读</span>
        )}

        {/* Tabs */}
        <div className="ml-auto flex gap-1 bg-white border border-[#E8E8E8] rounded-lg p-1">
          {[{ key: "messages", label: "消息列表" }, { key: "alerts", label: "报警配置" }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as "messages" | "alerts")}
              className={cn("px-4 py-1.5 rounded-md text-sm transition-colors", activeTab === key ? "bg-[#E8E8E8] text-[#111111]" : "text-[#999999] hover:text-[#333333]")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "messages" ? (
        <div className="flex flex-1 min-h-0">
          {/* Left: Message List */}
          <div className="w-96 border-r border-[#E8E8E8] flex flex-col flex-shrink-0">
            {/* Filter */}
            <div className="px-4 py-3 border-b border-[#E8E8E8] flex gap-1.5 flex-wrap">
              {[{ key: "all", label: "全部" }, { key: "collab", label: "🤝 合作" }, { key: "commerce", label: "💰 商务" }, { key: "spam", label: "🚨 垃圾" }, { key: "normal", label: "💬 普通" }].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilterCategory(key)}
                  className={cn("px-3 py-1 rounded-full text-xs transition-colors", filterCategory === key ? "bg-black/10 text-[#111111]" : "bg-[#E8E8E8] text-[#999999] hover:text-[#333333]")}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#1e1e1e]/50">
              {filtered.map((msg) => {
                const cat = CATEGORY_CONFIG[msg.category];
                const isSelected = selectedMsg?.id === msg.id;
                return (
                  <button
                    key={msg.id}
                    onClick={() => handleSelect(msg)}
                    className={cn("w-full text-left px-4 py-3.5 transition-colors hover:bg-white", isSelected && "bg-white", !msg.read && "border-l-2 border-[#CCCCCC]")}
                  >
                    <div className="flex items-start gap-3">
                      <img src={`https://unavatar.io/twitter/${msg.senderAvatar}`} className="w-8 h-8 rounded-full bg-[#E8E8E8] flex-shrink-0 mt-0.5" alt="" onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderAvatar}`; }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#111111] text-xs font-medium">{msg.sender}</span>
                          <Badge variant={cat.variant} className="text-[10px] py-0 px-1.5">{cat.emoji} {cat.label}</Badge>
                        </div>
                        <p className="text-[#999999] text-xs line-clamp-2">{msg.preview}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[#999999] text-[10px]">{msg.accountHandle}</span>
                          <span className="text-[#999999]/50 text-[10px]">·</span>
                          <span className="text-[#999999] text-[10px]">{timeAgo(msg.receivedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-16 text-[#999999]">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">暂无消息</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Message Detail */}
          <div className="flex-1 p-8">
            {selectedMsg ? (
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <img src={`https://unavatar.io/twitter/${selectedMsg.senderAvatar}`} className="w-10 h-10 rounded-full bg-[#E8E8E8]" alt="" onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedMsg.senderAvatar}`; }} />
                  <div>
                    <p className="text-[#111111] font-semibold">{selectedMsg.sender}</p>
                    <p className="text-[#999999] text-xs">发送给 {selectedMsg.accountHandle} · {timeAgo(selectedMsg.receivedAt)}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant={CATEGORY_CONFIG[selectedMsg.category].variant}>
                      {CATEGORY_CONFIG[selectedMsg.category].emoji} {CATEGORY_CONFIG[selectedMsg.category].label}
                    </Badge>
                  </div>
                </div>
                <div className="bg-white border border-[#E8E8E8] rounded-xl p-5">
                  <p className="text-[#111111] text-sm leading-relaxed">{selectedMsg.content}</p>
                </div>
                {(selectedMsg.category === "collab" || selectedMsg.category === "commerce") && (
                  <div className="flex gap-3 mt-4">
                    <Button size="sm">回复</Button>
                    <Button size="sm" variant="outline">标记已处理</Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[#999999]">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">选择一条消息查看详情</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Alert Config Tab */
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-xl space-y-6">
            {/* Lark */}
            <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-[#111111] text-xs font-bold">L</div>
                  <div>
                    <p className="text-[#111111] font-semibold text-sm">Lark（飞书）</p>
                    <p className="text-[#999999] text-xs">通过飞书机器人 Webhook 发送报警</p>
                  </div>
                </div>
                <Switch checked={larkEnabled} onCheckedChange={setLarkEnabled} />
              </div>
              <div>
                <label className="text-xs text-[#999999] mb-1.5 block">Webhook URL</label>
                <Input value={larkWebhook} onChange={(e) => setLarkWebhook(e.target.value)} placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/..." />
              </div>
              <div>
                <label className="text-xs text-[#999999] mb-2 block">触发条件</label>
                <div className="flex gap-2">
                  {[{ v: "collab", l: "仅合作邀约" }, { v: "all", l: "所有消息" }].map(({ v, l }) => (
                    <button key={v} onClick={() => setLarkTrigger(v)} className={cn("px-3 py-1.5 rounded-lg text-xs border transition-colors", larkTrigger === v ? "border-[#CCCCCC] bg-black/5 text-[#111111]" : "border-[#E0E0E0] text-[#999999]")}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline" onClick={() => handleTest("lark")} disabled={testing === "lark"}>
                  {testing === "lark" ? <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />发送中...</> : "测试发送"}
                </Button>
                {testResult === "lark" && <span className="text-[#00BA7C] text-xs flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />发送成功</span>}
              </div>
            </div>

            {/* Telegram */}
            <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-[#111111] text-xs font-bold">T</div>
                  <div>
                    <p className="text-[#111111] font-semibold text-sm">Telegram</p>
                    <p className="text-[#999999] text-xs">通过 Telegram Bot 发送报警消息</p>
                  </div>
                </div>
                <Switch checked={tgEnabled} onCheckedChange={setTgEnabled} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#999999] mb-1.5 block">Bot Token</label>
                  <Input value={tgToken} onChange={(e) => setTgToken(e.target.value)} placeholder="123456:ABC-DEF..." />
                </div>
                <div>
                  <label className="text-xs text-[#999999] mb-1.5 block">Chat ID</label>
                  <Input value={tgChatId} onChange={(e) => setTgChatId(e.target.value)} placeholder="-100xxxxxxxx" />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#999999] mb-2 block">触发条件</label>
                <div className="flex gap-2">
                  {[{ v: "collab", l: "仅合作邀约" }, { v: "all", l: "所有消息" }].map(({ v, l }) => (
                    <button key={v} onClick={() => setTgTrigger(v)} className={cn("px-3 py-1.5 rounded-lg text-xs border transition-colors", tgTrigger === v ? "border-[#CCCCCC] bg-black/5 text-[#111111]" : "border-[#E0E0E0] text-[#999999]")}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline" onClick={() => handleTest("tg")} disabled={testing === "tg"}>
                  {testing === "tg" ? <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />发送中...</> : "测试发送"}
                </Button>
                {testResult === "tg" && <span className="text-[#00BA7C] text-xs flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />发送成功</span>}
              </div>
            </div>

            <Button className="w-full">保存报警配置</Button>
          </div>
        </div>
      )}
    </div>
  );
}
