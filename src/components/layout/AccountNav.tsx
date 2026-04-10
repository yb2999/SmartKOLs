"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "人格配置", path: "persona" },
  { label: "自动发帖", path: "autopost" },
  { label: "信息源", path: "sources" },
  { label: "推文预览", path: "preview" },
];

export default function AccountNav({ accountId }: { accountId: string }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-1">
      {tabs.map((tab) => {
        const href = `/accounts/${accountId}/${tab.path}`;
        const isActive = pathname === href;
        return (
          <Link
            key={tab.path}
            href={href}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
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
