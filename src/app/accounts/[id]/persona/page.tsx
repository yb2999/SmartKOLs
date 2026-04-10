"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMockStore, Persona } from "@/lib/mock-store";
import PersonaForm from "@/components/persona/PersonaForm";
import DistillationPanel from "@/components/persona/DistillationPanel";
import HealthCard from "@/components/accounts/HealthCard";

const DEFAULT_PERSONA: Persona = {
  gender: "male",
  nationality: "",
  age: 25,
  interests: [],
  personalityTraits: [],
  writingStyle: "",
  bio: "",
  distillationSampleTweets: "",
};

export default function PersonaPage() {
  const params = useParams();
  const id = params.id as string;
  const { personas } = useMockStore();
  const persona = personas[id] || DEFAULT_PERSONA;
  const [currentPersona, setCurrentPersona] = useState<Persona>(persona);
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <h2 className="text-xl font-bold text-[#111111] mb-1">人格配置</h2>
      <p className="text-[#999999] text-sm mb-6">为该 AI KOL 账号定义人格背景与特征。</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <PersonaForm
            accountId={id}
            persona={currentPersona}
            onSaved={() => setSaved(true)}
          />
          {saved && (
            <p className="text-[#00BA7C] text-sm mt-3 text-center">✓ 人格配置已保存</p>
          )}
        </div>
        <div className="space-y-6">
          <HealthCard accountId={id} />
          <DistillationPanel
            currentPersona={currentPersona}
            onExtracted={(p) => {
              setCurrentPersona(p);
              setSaved(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
