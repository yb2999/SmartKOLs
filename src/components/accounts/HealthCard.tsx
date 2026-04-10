"use client";

import { useMockStore } from "@/lib/mock-store";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  accountId: string;
  compact?: boolean;
}

export default function HealthCard({ accountId, compact }: Props) {
  const { getHealthScore } = useMockStore();
  const health = getHealthScore(accountId);

  const colorMap = {
    low: "text-[#00BA7C] bg-green-50 border-green-100",
    medium: "text-orange-500 bg-orange-50 border-orange-100",
    high: "text-[#E05252] bg-red-50 border-red-100",
  };

  const riskLabel = { low: "健康", medium: "注意", high: "风险" };
  const IconComp = health.risk === "low" ? ShieldCheck : health.risk === "medium" ? Shield : ShieldAlert;

  if (compact) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border", colorMap[health.risk])}>
        <IconComp className="w-3 h-3" />
        {health.score}
      </span>
    );
  }

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", colorMap[health.risk])}>
          <IconComp className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[#999999] text-xs">账号健康分</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[#111111] text-2xl font-bold">{health.score}</p>
            <p className={cn("text-xs font-medium", health.risk === "low" ? "text-[#00BA7C]" : health.risk === "medium" ? "text-orange-500" : "text-[#E05252]")}>
              {riskLabel[health.risk]}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2.5">
        {health.breakdown.map((b) => (
          <div key={b.label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#999999]">{b.label}</span>
              <span className="text-[#111111] font-medium">{b.value}/{b.max}</span>
            </div>
            <div className="h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  b.value / b.max >= 0.8 ? "bg-[#00BA7C]" : b.value / b.max >= 0.6 ? "bg-orange-400" : "bg-[#E05252]"
                )}
                style={{ width: `${(b.value / b.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {health.risk !== "low" && (
        <div className="mt-4 pt-4 border-t border-[#E8E8E8]">
          <p className="text-xs text-[#999999]">
            {health.risk === "medium"
              ? "建议：检查发帖频率与内容一致性，保持稳定节奏"
              : "警告：多项指标异常，建议立即人工审核账号活动"}
          </p>
        </div>
      )}
    </div>
  );
}
