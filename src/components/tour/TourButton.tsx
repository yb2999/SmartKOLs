"use client";

import { useTour } from "./TourProvider";
import { PlayCircle } from "lucide-react";

export default function TourButton() {
  const { start } = useTour();
  return (
    <button
      onClick={start}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#999999] hover:text-[#111111] hover:bg-[#F7F7F7] w-full transition-colors"
    >
      <PlayCircle className="w-4 h-4" />
      <span>产品导览</span>
      <span className="ml-auto text-[10px] text-[#999999] bg-[#F0F0F0] px-1.5 py-0.5 rounded">2 min</span>
    </button>
  );
}
