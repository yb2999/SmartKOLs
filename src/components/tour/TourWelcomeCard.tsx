"use client";

import { useState, useEffect } from "react";
import { useTour } from "./TourProvider";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TourWelcomeCard() {
  const { hasSeenTour, start, markSeen } = useTour();
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || hasSeenTour || dismissed) return null;

  const handleDismiss = () => {
    markSeen();
    setDismissed(true);
  };

  return (
    <div className="bg-gradient-to-r from-[#111111] to-[#333333] text-white rounded-xl p-5 mb-6 flex items-center gap-4 relative overflow-hidden">
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-base mb-1">第一次访问 SmartKOLs？</p>
        <p className="text-white/70 text-sm">看一段 2 分钟的产品导览，了解矩阵管理的核心能力。</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          onClick={() => start()}
          className="bg-white text-[#111111] hover:bg-white/90 font-medium"
        >
          开始导览
        </Button>
        <button
          onClick={handleDismiss}
          className="text-white/60 hover:text-white transition-colors p-1.5"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
