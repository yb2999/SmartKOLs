"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [aiModel, setAiModel] = useState("claude-sonnet-4-6");
  const [apiKey, setApiKey] = useState("");
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState("zh");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111111]">设置</h1>
        <p className="text-[#999999] text-sm mt-1">系统配置与 API 密钥管理</p>
      </div>

      <div className="space-y-6">
        {/* AI Model */}
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 space-y-4">
          <h2 className="text-[#111111] font-semibold text-sm">AI 模型配置</h2>
          <div>
            <label className="text-xs text-[#999999] mb-1.5 block">Claude API Key</label>
            <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-ant-..." type="password" />
            <p className="text-[#999999] text-xs mt-1">用于人格蒸馏和推文生成功能</p>
          </div>
          <div>
            <label className="text-xs text-[#999999] mb-2 block">模型选择</label>
            <div className="flex gap-2">
              {[{ v: "claude-sonnet-4-6", l: "Claude Sonnet（推荐）" }, { v: "claude-haiku-4-5", l: "Claude Haiku（快速）" }].map(({ v, l }) => (
                <button key={v} onClick={() => setAiModel(v)} className={`px-3 py-2 rounded-lg text-xs border transition-colors ${aiModel === v ? "border-[#CCCCCC] bg-black/5 text-[#111111]" : "border-[#E0E0E0] text-[#999999]"}`}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        {/* General */}
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 space-y-4">
          <h2 className="text-[#111111] font-semibold text-sm">通用设置</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#111111] text-sm">自动保存配置</p>
              <p className="text-[#999999] text-xs">修改人格/发帖配置时自动保存</p>
            </div>
            <Switch checked={autoSave} onCheckedChange={setAutoSave} />
          </div>
          <div>
            <label className="text-xs text-[#999999] mb-2 block">界面语言</label>
            <div className="flex gap-2">
              {[{ v: "zh", l: "中文" }, { v: "en", l: "English" }].map(({ v, l }) => (
                <button key={v} onClick={() => setLanguage(v)} className={`px-3 py-2 rounded-lg text-xs border transition-colors ${language === v ? "border-[#CCCCCC] bg-black/5 text-[#111111]" : "border-[#E0E0E0] text-[#999999]"}`}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave}>保存设置</Button>
          {saved && <span className="text-[#00BA7C] text-sm flex items-center gap-1.5"><CheckCircle className="w-4 h-4" />已保存</span>}
        </div>
      </div>
    </div>
  );
}
