"use client";

import Link from "next/link";
import { Trash2, Users, FileText } from "lucide-react";
import { Account, useMockStore } from "@/lib/mock-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatNumber(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export default function AccountCard({ account }: { account: Account }) {
  const { deleteAccount } = useMockStore();

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl p-5 flex flex-col gap-4 hover:border-[#E0E0E0] transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={`https://unavatar.io/twitter/${account.avatarSeed}`}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.avatarSeed}`; }}
            alt={account.displayName}
            className="w-12 h-12 rounded-full bg-[#E8E8E8]"
          />
          <div>
            <p className="text-[#111111] font-semibold text-sm">{account.displayName}</p>
            <p className="text-[#999999] text-xs">{account.handle}</p>
          </div>
        </div>
        <Badge variant={account.active ? "success" : "secondary"}>
          {account.active ? "运行中" : "已停用"}
        </Badge>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex items-center gap-1.5 text-[#999999] text-xs">
          <Users className="w-3.5 h-3.5" />
          <span>{formatNumber(account.followersCount)} 粉丝</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#999999] text-xs">
          <FileText className="w-3.5 h-3.5" />
          <span>{formatNumber(account.tweetsCount)} 条推文</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/accounts/${account.id}/persona`} className="flex-1">
          <Button className="w-full" size="sm">管理</Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#999999] hover:text-red-400 hover:bg-red-900/20"
          onClick={() => deleteAccount(account.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
