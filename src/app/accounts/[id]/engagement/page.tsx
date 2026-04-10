"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useMockStore, EngagementConfig } from "@/lib/mock-store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TraitTagInput from "@/components/persona/TraitTagInput";
import { UserPlus, Repeat2, MessageCircle, Reply, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  return `${Math.floor(h / 24)} 天前`;
}

const COMMENT_STYLES = [
  { value: "supportive", label: "支持型" },
  { value: "questioning", label: "提问型" },
  { value: "value-add", label: "补充观点型" },
];

const REPLY_STYLES = [
  { value: "grateful", label: "感谢型" },
  { value: "interactive", label: "互动型" },
  { value: "brief", label: "简短确认" },
];

export default function EngagementPage() {
  const params = useParams();
  const id = params.id as string;
  const { getEngagementConfig, updateEngagementConfig, engagementLogs } = useMockStore();
  const [config, setConfig] = useState<EngagementConfig>(getEngagementConfig(id));
  const [saved, setSaved] = useState(false);

  const accountLogs = useMemo(
    () => engagementLogs.filter((l) => l.accountId === id).sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()),
    [engagementLogs, id]
  );

  const updateField = <K extends keyof EngagementConfig>(key: K, value: EngagementConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateEngagementConfig(id, config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Today's stats
  const todayStr = new Date().toDateString();
  const todayCount = {
    follow: accountLogs.filter((l) => l.type === "follow" && new Date(l.at).toDateString() === todayStr).length,
    retweet: accountLogs.filter((l) => l.type === "retweet" && new Date(l.at).toDateString() === todayStr).length,
    comment: accountLogs.filter((l) => l.type === "comment" && new Date(l.at).toDateString() === todayStr).length,
    reply: accountLogs.filter((l) => l.type === "reply" && new Date(l.at).toDateString() === todayStr).length,
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#111111] mb-1 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        社交互动自动化
      </h2>
      <p className="text-[#999999] text-sm mb-6">让账号自动去关注、转发、评论、回复 —— 看起来像真人，而不是只会发推的机器</p>

      {/* Today's Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1"><UserPlus className="w-4 h-4 text-[#999999]" /><span className="text-xs text-[#999999]">今日关注</span></div>
          <p className="text-[#111111] text-xl font-bold">{todayCount.follow}</p>
        </div>
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1"><Repeat2 className="w-4 h-4 text-[#999999]" /><span className="text-xs text-[#999999]">今日转发</span></div>
          <p className="text-[#111111] text-xl font-bold">{todayCount.retweet}</p>
        </div>
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1"><MessageCircle className="w-4 h-4 text-[#999999]" /><span className="text-xs text-[#999999]">今日评论</span></div>
          <p className="text-[#111111] text-xl font-bold">{todayCount.comment}</p>
        </div>
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1"><Reply className="w-4 h-4 text-[#999999]" /><span className="text-xs text-[#999999]">今日回复</span></div>
          <p className="text-[#111111] text-xl font-bold">{todayCount.reply}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: Config Cards */}
        <div data-tour="engagement-cards" className="space-y-4">
          {/* Auto Follow */}
          <div className="bg-white border border-[#E8E8E8] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                <h3 className="text-[#111111] font-semibold text-sm">自动关注</h3>
              </div>
              <Switch
                checked={config.autoFollow.enabled}
                onCheckedChange={(v) => updateField("autoFollow", { ...config.autoFollow, enabled: v })}
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#999999] mb-1 block">每日最多关注数</label>
                <Input
                  type="number"
                  value={config.autoFollow.maxPerDay}
                  onChange={(e) => updateField("autoFollow", { ...config.autoFollow, maxPerDay: parseInt(e.target.value) || 0 })}
                  className="h-9"
                />
                <p className="text-xs text-[#999999] mt-1">建议 ≤ 30，防触发 Twitter 频率限制</p>
              </div>
              <div>
                <label className="text-xs text-[#999999] mb-1 block">关注规则（关键词）</label>
                <TraitTagInput
                  tags={config.autoFollow.rules.map((r) => r.value)}
                  onChange={(tags) => updateField("autoFollow", { ...config.autoFollow, rules: tags.map((t) => ({ type: "keyword", value: t })) })}
                  placeholder="输入关键词后按 Enter，例如：crypto、DeFi"
                />
              </div>
            </div>
          </div>

          {/* Auto Retweet */}
          <div className="bg-white border border-[#E8E8E8] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Repeat2 className="w-4 h-4" />
                <h3 className="text-[#111111] font-semibold text-sm">自动转发</h3>
              </div>
              <Switch
                checked={config.autoRetweet.enabled}
                onCheckedChange={(v) => updateField("autoRetweet", { ...config.autoRetweet, enabled: v })}
              />
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#999999] mb-1 block">每日上限</label>
                  <Input type="number" value={config.autoRetweet.maxPerDay} onChange={(e) => updateField("autoRetweet", { ...config.autoRetweet, maxPerDay: parseInt(e.target.value) || 0 })} className="h-9" />
                </div>
                <div>
                  <label className="text-xs text-[#999999] mb-1 block">最小点赞数</label>
                  <Input type="number" value={config.autoRetweet.minLikes} onChange={(e) => updateField("autoRetweet", { ...config.autoRetweet, minLikes: parseInt(e.target.value) || 0 })} className="h-9" />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#999999] mb-1 block">白名单账号（优先转发）</label>
                <TraitTagInput
                  tags={config.autoRetweet.whitelist}
                  onChange={(tags) => updateField("autoRetweet", { ...config.autoRetweet, whitelist: tags })}
                  placeholder="@handle 后按 Enter"
                />
              </div>
              <div>
                <label className="text-xs text-[#999999] mb-1 block">延迟范围（分钟，模拟真人）</label>
                <div className="flex gap-2 items-center">
                  <Input type="number" value={config.autoRetweet.delayMin} onChange={(e) => updateField("autoRetweet", { ...config.autoRetweet, delayMin: parseInt(e.target.value) || 0 })} className="h-9" />
                  <span className="text-xs text-[#999999]">~</span>
                  <Input type="number" value={config.autoRetweet.delayMax} onChange={(e) => updateField("autoRetweet", { ...config.autoRetweet, delayMax: parseInt(e.target.value) || 0 })} className="h-9" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#111111]">启用 Quote Tweet（转发时带评论）</span>
                <Switch
                  checked={config.autoRetweet.quoteTweetEnabled}
                  onCheckedChange={(v) => updateField("autoRetweet", { ...config.autoRetweet, quoteTweetEnabled: v })}
                />
              </div>
            </div>
          </div>

          {/* Auto Comment */}
          <div className="bg-white border border-[#E8E8E8] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <h3 className="text-[#111111] font-semibold text-sm">自动评论</h3>
              </div>
              <Switch
                checked={config.autoComment.enabled}
                onCheckedChange={(v) => updateField("autoComment", { ...config.autoComment, enabled: v })}
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#999999] mb-1 block">每日评论上限</label>
                <Input type="number" value={config.autoComment.maxPerDay} onChange={(e) => updateField("autoComment", { ...config.autoComment, maxPerDay: parseInt(e.target.value) || 0 })} className="h-9" />
              </div>
              <div>
                <label className="text-xs text-[#999999] mb-2 block">评论风格</label>
                <div className="flex gap-2">
                  {COMMENT_STYLES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => updateField("autoComment", { ...config.autoComment, style: s.value })}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs border transition-colors",
                        config.autoComment.style === s.value ? "border-[#CCCCCC] bg-black/5 text-[#111111]" : "border-[#E0E0E0] text-[#999999]"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-[#999999] mb-2 block">目标选择模式</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateField("autoComment", { ...config.autoComment, mode: "latest" })}
                    className={cn("px-3 py-1.5 rounded-lg text-xs border", config.autoComment.mode === "latest" ? "border-[#CCCCCC] bg-black/5 text-[#111111]" : "border-[#E0E0E0] text-[#999999]")}
                  >只评最新一条</button>
                  <button
                    onClick={() => updateField("autoComment", { ...config.autoComment, mode: "random" })}
                    className={cn("px-3 py-1.5 rounded-lg text-xs border", config.autoComment.mode === "random" ? "border-[#CCCCCC] bg-black/5 text-[#111111]" : "border-[#E0E0E0] text-[#999999]")}
                  >随机选一条</button>
                </div>
              </div>
            </div>
          </div>

          {/* Auto Reply */}
          <div className="bg-white border border-[#E8E8E8] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Reply className="w-4 h-4" />
                <h3 className="text-[#111111] font-semibold text-sm">自动回复粉丝</h3>
              </div>
              <Switch
                checked={config.autoReply.enabled}
                onCheckedChange={(v) => updateField("autoReply", { ...config.autoReply, enabled: v })}
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#999999] mb-1 block">每日回复上限</label>
                <Input type="number" value={config.autoReply.maxPerDay} onChange={(e) => updateField("autoReply", { ...config.autoReply, maxPerDay: parseInt(e.target.value) || 0 })} className="h-9" />
              </div>
              <div>
                <label className="text-xs text-[#999999] mb-2 block">触发类型</label>
                <div className="flex gap-2 flex-wrap">
                  {[["mention", "被 @ 提及"], ["reply", "推文下评论"], ["dm", "私信"]].map(([v, l]) => {
                    const checked = config.autoReply.triggerTypes.includes(v);
                    return (
                      <button
                        key={v}
                        onClick={() => updateField("autoReply", {
                          ...config.autoReply,
                          triggerTypes: checked ? config.autoReply.triggerTypes.filter((t) => t !== v) : [...config.autoReply.triggerTypes, v],
                        })}
                        className={cn("px-3 py-1.5 rounded-lg text-xs border", checked ? "border-[#CCCCCC] bg-black/5 text-[#111111]" : "border-[#E0E0E0] text-[#999999]")}
                      >
                        {l}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#111111]">只回复关注者</span>
                <Switch
                  checked={config.autoReply.onlyFollowers}
                  onCheckedChange={(v) => updateField("autoReply", { ...config.autoReply, onlyFollowers: v })}
                />
              </div>
              <div>
                <label className="text-xs text-[#999999] mb-2 block">回复风格</label>
                <div className="flex gap-2">
                  {REPLY_STYLES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => updateField("autoReply", { ...config.autoReply, style: s.value })}
                      className={cn("px-3 py-1.5 rounded-lg text-xs border", config.autoReply.style === s.value ? "border-[#CCCCCC] bg-black/5 text-[#111111]" : "border-[#E0E0E0] text-[#999999]")}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">保存互动配置</Button>
          {saved && <p className="text-[#00BA7C] text-sm text-center">✓ 配置已保存</p>}
        </div>

        {/* Right: Engagement Log */}
        <div data-tour="engagement-log" className="bg-white border border-[#E8E8E8] rounded-xl p-5 h-fit">
          <h3 className="text-[#111111] font-semibold text-sm mb-4">互动日志（近 7 天）</h3>
          <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
            {accountLogs.length === 0 && (
              <p className="text-[#999999] text-sm text-center py-10">暂无互动记录</p>
            )}
            {accountLogs.map((log) => {
              const typeInfo = {
                follow: { icon: <UserPlus className="w-3.5 h-3.5" />, label: "关注了", color: "text-blue-500 bg-blue-50" },
                retweet: { icon: <Repeat2 className="w-3.5 h-3.5" />, label: "转发了", color: "text-[#00BA7C] bg-green-50" },
                comment: { icon: <MessageCircle className="w-3.5 h-3.5" />, label: "评论了", color: "text-orange-500 bg-orange-50" },
                reply: { icon: <Reply className="w-3.5 h-3.5" />, label: "回复了", color: "text-purple-500 bg-purple-50" },
              }[log.type];
              return (
                <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-[#E8E8E8] last:border-b-0">
                  <span className={cn("flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center", typeInfo.color)}>
                    {typeInfo.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#111111]">
                      <span className="text-[#999999]">{typeInfo.label}</span>{" "}
                      <span className="font-medium">{log.targetHandle}</span>
                      {log.targetName && <span className="text-[#999999]"> · {log.targetName}</span>}
                    </p>
                    {log.tweetExcerpt && <p className="text-xs text-[#999999] mt-1 italic truncate">&ldquo;{log.tweetExcerpt}&rdquo;</p>}
                    {log.commentText && <p className="text-xs text-[#111111] mt-1 truncate">💬 {log.commentText}</p>}
                    {log.replyText && <p className="text-xs text-[#111111] mt-1 truncate">↩️ {log.replyText}</p>}
                    <p className="text-[10px] text-[#999999] mt-1">{timeAgo(log.at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
