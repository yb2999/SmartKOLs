"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMockStore, AutopostConfig } from "@/lib/mock-store";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TraitTagInput from "@/components/persona/TraitTagInput";
import { cn } from "@/lib/utils";

const TONES = ["随意", "专业", "幽默", "思考型", "大胆", "学术"];
const DAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const FREQUENCIES: Record<string, number> = {
  "每天1次": 1,
  "每天3次": 3,
  "每天5次": 5,
};

const DEFAULT_CONFIG: AutopostConfig = {
  enabled: false,
  frequency: "每天1次",
  scheduledTimes: ["09:00"],
  activeDays: ["Mon", "Wed", "Fri"],
  tone: "casual",
  topics: [],
  avoidTopics: [],
  includeHashtags: false,
  includeEmojis: false,
};

export default function AutopostPage() {
  const params = useParams();
  const id = params.id as string;
  const { autopostConfigs, updateAutopost } = useMockStore();
  const [config, setConfig] = useState<AutopostConfig>(autopostConfigs[id] || DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof AutopostConfig>(key: K, value: AutopostConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleFrequencyChange = (freq: string) => {
    const count = FREQUENCIES[freq] || 1;
    const times = Array.from({ length: count }, (_, i) =>
      config.scheduledTimes[i] || `${9 + i * 3}:00`.padStart(5, "0")
    );
    setConfig((prev) => ({ ...prev, frequency: freq, scheduledTimes: times }));
  };

  const toggleDay = (day: string) => {
    const days = config.activeDays.includes(day)
      ? config.activeDays.filter((d) => d !== day)
      : [...config.activeDays, day];
    set("activeDays", days);
  };

  const handleSave = () => {
    updateAutopost(id, config);
    setSaved(true);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#111111] mb-1">自动发帖配置</h2>
      <p className="text-[#999999] text-sm mb-6">配置该账号自动发帖的时间、频率与风格。</p>

      <div className="space-y-8 max-w-2xl">
        {/* Enable Toggle */}
        <div className="flex items-center justify-between bg-white border border-[#E8E8E8] rounded-xl p-4">
          <div>
            <p className="text-[#111111] font-medium text-sm">自动发帖</p>
            <p className="text-[#999999] text-xs mt-0.5">按计划自动生成并发布推文</p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(v) => set("enabled", v)}
          />
        </div>

        {/* Tone */}
        <div>
          <label className="text-sm text-[#999999] mb-3 block">发帖风格</label>
          <div className="grid grid-cols-3 gap-2">
            {TONES.map((tone) => (
              <button
                key={tone}
                onClick={() => set("tone", tone)}
                className={cn(
                  "px-3 py-2.5 rounded-lg text-sm capitalize border transition-colors",
                  config.tone === tone
                    ? "border-[#CCCCCC] bg-black/5 text-[#111111]"
                    : "border-[#E0E0E0] bg-white text-[#999999] hover:border-[#E8E8E8]"
                )}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="text-sm text-[#999999] mb-3 block">发帖频率</label>
          <div className="flex gap-2">
            {Object.keys(FREQUENCIES).map((freq) => (
              <button
                key={freq}
                onClick={() => handleFrequencyChange(freq)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm border transition-colors",
                  config.frequency === freq
                    ? "border-[#CCCCCC] bg-black/5 text-[#111111]"
                    : "border-[#E0E0E0] bg-white text-[#999999] hover:border-[#E8E8E8]"
                )}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        {/* Scheduled Times */}
        <div>
          <label className="text-sm text-[#999999] mb-3 block">发帖时间</label>
          <div className="flex gap-3 flex-wrap">
            {config.scheduledTimes.map((time, i) => (
              <Input
                key={i}
                type="time"
                value={time}
                onChange={(e) => {
                  const times = [...config.scheduledTimes];
                  times[i] = e.target.value;
                  set("scheduledTimes", times);
                }}
                className="w-36"
              />
            ))}
          </div>
        </div>

        {/* Active Days */}
        <div>
          <label className="text-sm text-[#999999] mb-3 block">活跃天数</label>
          <div className="flex gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={cn(
                  "w-10 h-10 rounded-lg text-xs font-medium border transition-colors",
                  config.activeDays.includes(day)
                    ? "border-[#CCCCCC] bg-black/5 text-[#111111]"
                    : "border-[#E0E0E0] bg-white text-[#999999] hover:border-[#E8E8E8]"
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div>
          <label className="text-sm text-[#999999] mb-1.5 block">发帖话题</label>
          <TraitTagInput
            tags={config.topics}
            onChange={(tags) => set("topics", tags)}
            placeholder="输入话题后按 Enter"
          />
        </div>

        <div>
          <label className="text-sm text-[#999999] mb-1.5 block">避免话题</label>
          <TraitTagInput
            tags={config.avoidTopics}
            onChange={(tags) => set("avoidTopics", tags)}
            placeholder="输入要避免的话题后按 Enter"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#111111]">包含 Hashtag</span>
            <Switch
              checked={config.includeHashtags}
              onCheckedChange={(v) => set("includeHashtags", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#111111]">包含表情符号</span>
            <Switch
              checked={config.includeEmojis}
              onCheckedChange={(v) => set("includeEmojis", v)}
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          保存配置
        </Button>
        {saved && (
          <p className="text-[#00BA7C] text-sm text-center">✓ 配置已保存</p>
        )}
      </div>
    </div>
  );
}
