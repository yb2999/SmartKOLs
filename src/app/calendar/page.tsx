"use client";

import { useState, useMemo } from "react";
import { useMockStore } from "@/lib/mock-store";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const DAY_NAMES_CN = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const DAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_KEYS_CN = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

interface ScheduledPost {
  accountId: string;
  time: string;
  topic: string;
  content: string;
}

export default function CalendarPage() {
  const { accounts, autopostConfigs, tweetPreviews, drafts } = useMockStore();
  const [baseDate, setBaseDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Build schedule for a given date
  const getSchedule = (date: Date): ScheduledPost[] => {
    const dayIdx = date.getDay();
    const dayKey = DAY_KEYS[dayIdx];
    const dayKeyCn = DAY_KEYS_CN[dayIdx];
    const posts: ScheduledPost[] = [];

    accounts.forEach((acc) => {
      const cfg = autopostConfigs[acc.id];
      if (!cfg || !cfg.enabled) return;
      const matchesDay = cfg.activeDays.includes(dayKey) || cfg.activeDays.includes(dayKeyCn);
      if (!matchesDay) return;
      cfg.scheduledTimes.forEach((t) => {
        const previews = tweetPreviews[acc.id] || [];
        const content = previews[0] || `AI 将根据 ${acc.displayName} 的人格与信息源生成推文`;
        const topic = cfg.topics[0] || acc.displayName;
        posts.push({ accountId: acc.id, time: t, topic, content });
      });
    });

    // Add drafts scheduled for this day
    drafts.filter((d) => d.status === "approved").forEach((d) => {
      const dt = new Date(d.scheduledTime);
      if (dt.toDateString() === date.toDateString()) {
        posts.push({
          accountId: d.accountId,
          time: `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`,
          topic: d.topic,
          content: d.content,
        });
      }
    });

    return posts.sort((a, b) => a.time.localeCompare(b.time));
  };

  // Compute 7 days starting from baseDate
  const week = useMemo(() => {
    const start = new Date(baseDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [baseDate]);

  const prevWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - 7);
    setBaseDate(d);
  };

  const nextWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + 7);
    setBaseDate(d);
  };

  const today = () => setBaseDate(new Date());

  const getAccount = (id: string) => accounts.find((a) => a.id === id);
  const todayStr = new Date().toDateString();

  const totalThisWeek = week.reduce((sum, d) => sum + getSchedule(d).length, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
            <CalendarDays className="w-6 h-6" />
            内容日历
          </h1>
          <p className="text-[#999999] text-sm mt-1">整个账号矩阵的发帖排期概览 · 本周共 {totalThisWeek} 条排期</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevWeek} className="p-2 rounded-lg hover:bg-[#F0F0F0] text-[#999999] hover:text-[#111111]">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={today} className="px-3 py-1.5 rounded-lg text-xs bg-white border border-[#E8E8E8] hover:bg-[#F7F7F7] text-[#111111]">
            今天
          </button>
          <button onClick={nextWeek} className="p-2 rounded-lg hover:bg-[#F0F0F0] text-[#999999] hover:text-[#111111]">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div data-tour="week-grid" className="grid grid-cols-7 gap-3 mb-6">
        {week.map((d, i) => {
          const schedule = getSchedule(d);
          const isToday = d.toDateString() === todayStr;
          const isSelected = selectedDay && d.toDateString() === selectedDay.toDateString();
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(d)}
              className={cn(
                "bg-white border rounded-xl p-3 text-left transition-colors min-h-[180px] flex flex-col",
                isSelected ? "border-[#111111]" : "border-[#E8E8E8] hover:border-[#CCCCCC]"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#999999]">{DAY_NAMES_CN[d.getDay()]}</span>
                <span className={cn(
                  "text-sm font-semibold",
                  isToday ? "text-white bg-[#111111] rounded-full w-6 h-6 flex items-center justify-center" : "text-[#111111]"
                )}>{d.getDate()}</span>
              </div>
              <div className="flex-1 space-y-1 overflow-hidden">
                {schedule.slice(0, 4).map((post, idx) => {
                  const acc = getAccount(post.accountId);
                  return (
                    <div key={idx} className="flex items-center gap-1 text-xs bg-[#F7F7F7] rounded px-1.5 py-1">
                      <span className="text-[#999999] text-[10px]">{post.time}</span>
                      <span className="text-[#111111] truncate">{acc?.displayName}</span>
                    </div>
                  );
                })}
                {schedule.length > 4 && (
                  <div className="text-xs text-[#999999] pl-1.5">+{schedule.length - 4} 更多</div>
                )}
                {schedule.length === 0 && (
                  <div className="text-xs text-[#CCCCCC] pl-1.5 pt-1">暂无排期</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Detail */}
      {selectedDay && (
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-6">
          <h2 className="text-[#111111] font-semibold mb-4">
            {selectedDay.getMonth() + 1} 月 {selectedDay.getDate()} 日 · {DAY_NAMES_CN[selectedDay.getDay()]} 的排期详情
          </h2>
          <div className="space-y-3 max-w-3xl">
            {getSchedule(selectedDay).map((post, i) => {
              const acc = getAccount(post.accountId);
              return (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-[#E8E8E8] last:border-b-0">
                  <div className="text-xs text-[#999999] w-14 flex-shrink-0 pt-1">{post.time}</div>
                  <img
                    src={`https://unavatar.io/twitter/${acc?.avatarSeed}`}
                    alt=""
                    className="w-8 h-8 rounded-full bg-[#E8E8E8] flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${acc?.avatarSeed}`; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#111111] font-medium text-sm">{acc?.displayName}</span>
                      <span className="text-[#999999] text-xs">{acc?.handle}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-[#F0F0F0] text-[#999999]">{post.topic}</span>
                    </div>
                    <p className="text-[#111111] text-sm line-clamp-2">{post.content}</p>

                  </div>
                </div>
              );
            })}
            {getSchedule(selectedDay).length === 0 && (
              <p className="text-[#999999] text-sm text-center py-6">这一天没有计划的发帖。可以在账号的&ldquo;自动发帖&rdquo;页配置。</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
