"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "人格配置", path: "persona" },
  { label: "信息源", path: "sources" },
  { label: "自动发帖", path: "autopost" },
  { label: "互动自动化", path: "engagement" },
  { label: "推文预览", path: "preview" },
  { label: "数据分析", path: "analytics" },
];

export default function AccountNav({ accountId }: { accountId: string }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 overflow-x-auto">
      {tabs.map((tab) => {
        const href = `/accounts/${accountId}/${tab.path}`;
        const isActive = pathname === href;
        return (
          <Link
            key={tab.path}
            href={href}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              isActive
                ? "border-[#111111] text-[#111111]"
                : "border-transparent text-[#999999] hover:text-[#333333]"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
