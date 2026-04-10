"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMockStore } from "@/lib/mock-store";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Heart, Repeat2, MessageCircle, Share } from "lucide-react";

export default function PreviewPage() {
  const params = useParams();
  const id = params.id as string;
  const { accounts, tweetPreviews } = useMockStore();
  const account = accounts.find((a) => a.id === id);
  const tweets = tweetPreviews[id] || [
    "Excited to share some thoughts on the latest trends in AI and technology. Stay tuned for more insights!",
  ];

  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [currentTweet, setCurrentTweet] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const next = (index + 1) % tweets.length;
    setIndex(next);
    setCurrentTweet(tweets[next]);
    setLoading(false);
    setGenerated(true);
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div>
      <h2 className="text-xl font-bold text-[#111111] mb-1">AI 推文预览</h2>
      <p className="text-[#999999] text-sm mb-8">
        根据该账号的人格配置、发帖话题和信息源内容自动生成。
      </p>

      <div className="max-w-lg space-y-6">
        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              正在生成推文...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              {generated ? "重新生成" : "生成推文"}
            </>
          )}
        </Button>

        {generated && !loading && account && (
          <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5">
            {/* Tweet Header */}
            <div className="flex items-start gap-3 mb-3">
              <img
                src={`https://unavatar.io/twitter/${account.avatarSeed}`}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.avatarSeed}`; }}
                alt={account.displayName}
                className="w-10 h-10 rounded-full bg-[#E8E8E8] flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[#111111] font-bold text-sm">{account.displayName}</span>
                  <span className="text-[#999999] text-sm">{account.handle}</span>
                  <span className="text-[#2a2a2a] text-sm">·</span>
                  <span className="text-[#999999] text-sm">{timeStr}</span>
                </div>
                <p className="text-[#111111] text-sm mt-2 leading-relaxed whitespace-pre-line">
                  {currentTweet}
                </p>
              </div>
            </div>

            {/* Tweet Actions */}
            <div className="flex items-center justify-between text-[#999999] pt-3 border-t border-[#E8E8E8]">
              <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors text-xs">
                <MessageCircle className="w-4 h-4" />
                <span>12</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-green-400 transition-colors text-xs">
                <Repeat2 className="w-4 h-4" />
                <span>48</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-red-400 transition-colors text-xs">
                <Heart className="w-4 h-4" />
                <span>203</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors text-xs">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {generated && !loading && (
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleGenerate}>
              重新生成
            </Button>
            <Button
              className="flex-1 opacity-50 cursor-not-allowed"
              title="即将上线"
              disabled
            >
              审核并排期
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
