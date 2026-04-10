"use client";

import { useState } from "react";
import { Persona, useMockStore } from "@/lib/mock-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TraitTagInput from "./TraitTagInput";

interface Props {
  accountId: string;
  persona: Persona;
  onSaved: () => void;
}

export default function PersonaForm({ accountId, persona, onSaved }: Props) {
  const { updatePersona } = useMockStore();
  const [form, setForm] = useState<Persona>({ ...persona });

  const set = (key: keyof Persona, value: string | number | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updatePersona(accountId, form);
    onSaved();
  };

  return (
    <div className="space-y-5">
      {/* Gender */}
      <div>
        <label className="text-sm text-[#999999] mb-2 block">性别</label>
        <div className="flex gap-3">
          {[["male","男"], ["female","女"], ["non-binary","非二元"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => set("gender", val)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                form.gender === val
                  ? "bg-[#111111] text-white border border-[#111111]"
                  : "bg-white border border-[#E8E8E8] text-[#999999] hover:border-[#CCCCCC]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Nationality & Age */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[#999999] mb-1.5 block">国籍</label>
          <Input
            value={form.nationality}
            onChange={(e) => set("nationality", e.target.value)}
            placeholder="例如：中国人、美国人"
          />
        </div>
        <div>
          <label className="text-sm text-[#999999] mb-1.5 block">年龄</label>
          <Input
            type="number"
            value={form.age}
            onChange={(e) => set("age", parseInt(e.target.value) || 0)}
            placeholder="例如：28"
          />
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="text-sm text-[#999999] mb-1.5 block">兴趣爱好</label>
        <TraitTagInput
          tags={form.interests}
          onChange={(tags) => set("interests", tags)}
          placeholder="输入兴趣后按 Enter"
        />
      </div>

      {/* Personality Traits */}
      <div>
        <label className="text-sm text-[#999999] mb-1.5 block">性格特征</label>
        <TraitTagInput
          tags={form.personalityTraits}
          onChange={(tags) => set("personalityTraits", tags)}
          placeholder="输入性格标签后按 Enter"
        />
      </div>

      {/* Writing Style */}
      <div>
        <label className="text-sm text-[#999999] mb-1.5 block">写作风格</label>
        <Input
          value={form.writingStyle}
          onChange={(e) => set("writingStyle", e.target.value)}
          placeholder="例如：随意幽默，喜欢用数据支撑观点"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="text-sm text-[#999999] mb-1.5 block">个人简介</label>
        <Textarea
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          placeholder="Twitter Bio 文案..."
          rows={3}
        />
      </div>

      <Button onClick={handleSave} className="w-full">保存人格配置</Button>
    </div>
  );
}
