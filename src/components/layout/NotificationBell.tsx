"use client";

import { useState } from "react";
import Link from "next/link";
import { useMockStore } from "@/lib/mock-store";
import { Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  return `${Math.floor(h / 24)} 天前`;
}

const TYPE_ICONS: Record<string, string> = {
  post: "📝",
  message: "💬",
  health: "⚠️",
  action: "⚡",
  engagement: "🤝",
};

export default function NotificationBell() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useMockStore();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#999999] hover:text-[#333333] hover:bg-[#F7F7F7] w-full transition-colors"
      >
        <Bell className="w-4 h-4" />
        通知
        {unreadCount > 0 && (
          <span className="ml-auto min-w-[18px] h-[18px] rounded-full bg-[#E05252] text-white text-[10px] font-bold flex items-center justify-center px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-full top-0 ml-2 w-96 bg-white border border-[#E8E8E8] rounded-xl shadow-xl z-50 max-h-[520px] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E8E8]">
              <h3 className="text-[#111111] font-semibold text-sm">通知中心</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="flex items-center gap-1 text-xs text-[#999999] hover:text-[#111111]"
                >
                  <CheckCheck className="w-3.5 h-3.5" />全部标为已读
                </button>
              )}
            </div>
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 && (
                <p className="text-center text-[#999999] text-sm py-10">暂无通知</p>
              )}
              {notifications.map((n) => {
                const content = (
                  <div className={cn(
                    "flex items-start gap-3 px-4 py-3 border-b border-[#E8E8E8] last:border-b-0 hover:bg-[#F7F7F7] cursor-pointer transition-colors",
                    !n.read && "bg-[#F7F7F7]/60"
                  )} onClick={() => markNotificationRead(n.id)}>
                    <span className="text-lg flex-shrink-0">{TYPE_ICONS[n.type] || "📌"}</span>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-xs", !n.read ? "text-[#111111] font-medium" : "text-[#999999]")}>{n.text}</p>
                      <p className="text-[10px] text-[#999999] mt-0.5">{timeAgo(n.at)}</p>
                    </div>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#E05252] flex-shrink-0 mt-1.5" />}
                  </div>
                );
                return n.link ? (
                  <Link key={n.id} href={n.link} onClick={() => setOpen(false)}>
                    {content}
                  </Link>
                ) : (
                  <div key={n.id}>{content}</div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
