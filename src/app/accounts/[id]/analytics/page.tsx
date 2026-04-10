"use client";

import { useParams } from "next/navigation";
import { useMockStore } from "@/lib/mock-store";
import { useMemo } from "react";
import { TrendingUp, Heart, Repeat2, MessageCircle, BarChart3 } from "lucide-react";

function hashString(s: string): number {
  return s.split("").reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0);
}

function seededRandom(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function formatNumber(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

export default function AnalyticsPage() {
  const params = useParams();
  const id = params.id as string;
  const { accounts } = useMockStore();
  const account = accounts.find((a) => a.id === id);

  const data = useMemo(() => {
    const seed = hashString(id);
    const rand = seededRandom(seed);

    // Follower growth - 30 days
    const baseFollowers = account?.followersCount || 100000;
    const growth = Array.from({ length: 30 }, (_, i) => {
      const dailyChange = Math.floor((rand() - 0.3) * 500);
      return { day: i + 1, value: baseFollowers - (29 - i) * 200 + dailyChange };
    });

    // Engagement totals (last 30 days)
    const totalLikes = Math.floor(baseFollowers * (0.02 + rand() * 0.05));
    const totalRetweets = Math.floor(totalLikes * (0.15 + rand() * 0.1));
    const totalComments = Math.floor(totalLikes * (0.08 + rand() * 0.05));

    // Heatmap 7x24
    const heatmap = Array.from({ length: 7 }, (_, day) =>
      Array.from({ length: 24 }, (_, hour) => {
        const isWorkingHour = hour >= 8 && hour <= 22;
        const isWeekday = day >= 1 && day <= 5;
        const base = isWorkingHour && isWeekday ? 0.5 : 0.15;
        return Math.floor((base + rand() * 0.5) * 100);
      })
    );

    // Top 5 tweets
    const topTweets = Array.from({ length: 5 }, (_, i) => ({
      content: [
        "比特币 ETF 资金流入创新高，市场情绪逆转中。",
        "AI 模型的 benchmark 不等于真实体验 —— 这是一个被低估的事实。",
        "链上数据：鲸鱼地址持仓中位数正在上升。",
        "开源不是理想主义，是最实用的商业策略。",
        "写代码 10 年最大的感悟：简单就是最高级的复杂。",
      ][i],
      likes: Math.floor(1000 + rand() * 5000),
      retweets: Math.floor(100 + rand() * 800),
      comments: Math.floor(50 + rand() * 400),
      time: `${Math.floor(rand() * 30) + 1} 天前`,
    }));

    return { growth, totalLikes, totalRetweets, totalComments, heatmap, topTweets };
  }, [id, account]);

  if (!account) return <div>Account not found</div>;

  // Growth chart rendering (SVG)
  const maxGrowth = Math.max(...data.growth.map((g) => g.value));
  const minGrowth = Math.min(...data.growth.map((g) => g.value));
  const growthRange = maxGrowth - minGrowth || 1;
  const chartWidth = 700;
  const chartHeight = 200;
  const pts = data.growth.map((g, i) => {
    const x = (i / (data.growth.length - 1)) * chartWidth;
    const y = chartHeight - ((g.value - minGrowth) / growthRange) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  }).join(" ");
  const growthDelta = data.growth[data.growth.length - 1].value - data.growth[0].value;
  const growthPct = ((growthDelta / data.growth[0].value) * 100).toFixed(1);

  const maxHeat = Math.max(...data.heatmap.flat());

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#111111] mb-1 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          数据分析
        </h2>
        <p className="text-[#999999] text-sm">近 30 天的账号数据表现与趋势</p>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#999999] text-xs">粉丝增长</span>
            <TrendingUp className="w-4 h-4 text-[#00BA7C]" />
          </div>
          <p className="text-[#111111] text-2xl font-bold">+{formatNumber(Math.abs(growthDelta))}</p>
          <p className="text-xs text-[#00BA7C] mt-1">+{growthPct}% 近 30 天</p>
        </div>
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#999999] text-xs">总点赞</span>
            <Heart className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-[#111111] text-2xl font-bold">{formatNumber(data.totalLikes)}</p>
          <p className="text-xs text-[#999999] mt-1">近 30 天</p>
        </div>
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#999999] text-xs">总转发</span>
            <Repeat2 className="w-4 h-4 text-[#00BA7C]" />
          </div>
          <p className="text-[#111111] text-2xl font-bold">{formatNumber(data.totalRetweets)}</p>
          <p className="text-xs text-[#999999] mt-1">近 30 天</p>
        </div>
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#999999] text-xs">总评论</span>
            <MessageCircle className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-[#111111] text-2xl font-bold">{formatNumber(data.totalComments)}</p>
          <p className="text-xs text-[#999999] mt-1">近 30 天</p>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white border border-[#E8E8E8] rounded-xl p-6">
        <h3 className="text-[#111111] font-semibold text-sm mb-4">粉丝增长趋势（近 30 天）</h3>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="w-full h-auto">
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00BA7C" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00BA7C" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            fill="url(#growthGradient)"
            points={`0,${chartHeight} ${pts} ${chartWidth},${chartHeight}`}
          />
          <polyline
            fill="none"
            stroke="#00BA7C"
            strokeWidth="2"
            points={pts}
          />
        </svg>
      </div>

      {/* Heatmap */}
      <div className="bg-white border border-[#E8E8E8] rounded-xl p-6">
        <h3 className="text-[#111111] font-semibold text-sm mb-4">最佳发帖时间热力图</h3>
        <div className="overflow-x-auto">
          <table className="text-xs">
            <thead>
              <tr>
                <th className="w-10"></th>
                {Array.from({ length: 24 }, (_, h) => (
                  <th key={h} className="text-center text-[#999999] font-normal w-6 text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["一", "二", "三", "四", "五", "六", "日"].map((day, dayIdx) => (
                <tr key={dayIdx}>
                  <td className="text-[#999999] text-xs pr-2">周{day}</td>
                  {data.heatmap[(dayIdx + 1) % 7].map((val, hourIdx) => {
                    const intensity = val / maxHeat;
                    return (
                      <td key={hourIdx} className="p-0.5">
                        <div
                          className="w-5 h-5 rounded"
                          style={{
                            backgroundColor: `rgba(17, 17, 17, ${intensity * 0.8 + 0.05})`,
                          }}
                          title={`${val}% 互动率`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 5 Tweets */}
      <div className="bg-white border border-[#E8E8E8] rounded-xl p-6">
        <h3 className="text-[#111111] font-semibold text-sm mb-4">高互动推文 Top 5</h3>
        <div className="space-y-3">
          {data.topTweets.map((tw, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b border-[#E8E8E8] last:border-b-0">
              <div className="text-2xl font-bold text-[#E0E0E0] w-8">#{i + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[#111111] text-sm mb-2">{tw.content}</p>
                <div className="flex gap-4 text-xs text-[#999999]">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {formatNumber(tw.likes)}</span>
                  <span className="flex items-center gap-1"><Repeat2 className="w-3 h-3" /> {formatNumber(tw.retweets)}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {formatNumber(tw.comments)}</span>
                  <span className="ml-auto">{tw.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
