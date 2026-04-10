"use client";

import { useState } from "react";
import { useMockStore } from "@/lib/mock-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  accountIds: string[];
  onClose: () => void;
}

export default function PersonaTemplateModal({ accountIds, onClose }: Props) {
  const { personaTemplates, applyTemplateToAccounts } = useMockStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleApply = () => {
    if (!selectedId) return;
    applyTemplateToAccounts(accountIds, selectedId);
    setDone(true);
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>套用人格模板</DialogTitle>
          <DialogDescription>为选中的 {accountIds.length} 个账号批量应用人格配置。</DialogDescription>
        </DialogHeader>

        {!done ? (
          <div className="space-y-3">
            {personaTemplates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedId(tpl.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-colors",
                  selectedId === tpl.id
                    ? "border-[#CCCCCC] bg-black/5"
                    : "border-[#E8E8E8] hover:border-[#E0E0E0] bg-white"
                )}
              >
                <div className="flex items-start justify-between">
                  <p className="text-[#111111] font-medium text-sm">{tpl.name}</p>
                  {selectedId === tpl.id && <CheckCircle className="w-4 h-4 text-[#111111] flex-shrink-0" />}
                </div>
                <p className="text-[#999999] text-xs mt-1">{tpl.description}</p>
                <div className="flex gap-1 flex-wrap mt-2">
                  {tpl.persona.personalityTraits.slice(0, 3).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-[#E8E8E8] text-[#999999] text-xs">{t}</span>
                  ))}
                </div>
              </button>
            ))}

            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={onClose}>取消</Button>
              <Button onClick={handleApply} disabled={!selectedId}>应用模板</Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="w-10 h-10 mx-auto mb-3 text-[#00BA7C]" />
            <p className="text-[#111111] font-medium">已为 {accountIds.length} 个账号套用模板</p>
            <Button className="mt-4" onClick={onClose}>完成</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
