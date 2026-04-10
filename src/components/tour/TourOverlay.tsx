"use client";

import { useMemo, useState, useEffect } from "react";
import { useTour } from "./TourProvider";
import { TOUR_STEPS } from "@/lib/tour-steps";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

const PAD = 8;
const TOOLTIP_WIDTH = 400;
const TOOLTIP_OFFSET = 16;
const MOBILE_BREAKPOINT = 768;

export default function TourOverlay() {
  const { active, currentStep, targetRect, totalSteps, next, prev, skip, end } = useTour();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const step = TOUR_STEPS[currentStep];
  const isFull = step?.highlight === "full";

  const svgPath = useMemo(() => {
    if (typeof window === "undefined") return "";
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (!targetRect || isFull) {
      // Full darken, no cutout
      return `M 0,0 L ${w},0 L ${w},${h} L 0,${h} Z`;
    }
    const x1 = Math.max(0, targetRect.x - PAD);
    const y1 = Math.max(0, targetRect.y - PAD);
    const x2 = Math.min(w, targetRect.x + targetRect.width + PAD);
    const y2 = Math.min(h, targetRect.y + targetRect.height + PAD);
    return `M 0,0 L ${w},0 L ${w},${h} L 0,${h} Z
            M ${x1},${y1} L ${x1},${y2} L ${x2},${y2} L ${x2},${y1} Z`;
  }, [targetRect, isFull]);

  const tooltipPosition = useMemo(() => {
    if (typeof window === "undefined") return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    // Mobile: always bottom sheet
    if (isMobile) {
      return { bottom: "16px", left: "16px", right: "16px", transform: "none" };
    }

    const w = window.innerWidth;
    const h = window.innerHeight;

    if (!targetRect || isFull) {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }

    const targetCenterX = targetRect.x + targetRect.width / 2;
    const targetCenterY = targetRect.y + targetRect.height / 2;
    const spaceRight = w - (targetRect.x + targetRect.width);
    const spaceBelow = h - (targetRect.y + targetRect.height);
    const spaceAbove = targetRect.y;

    // Prefer: below > above > right > left
    if (spaceBelow >= 220) {
      const left = Math.max(16, Math.min(w - TOOLTIP_WIDTH - 16, targetCenterX - TOOLTIP_WIDTH / 2));
      return { top: `${targetRect.y + targetRect.height + TOOLTIP_OFFSET}px`, left: `${left}px`, transform: "none" };
    } else if (spaceAbove >= 220) {
      const left = Math.max(16, Math.min(w - TOOLTIP_WIDTH - 16, targetCenterX - TOOLTIP_WIDTH / 2));
      return { bottom: `${h - targetRect.y + TOOLTIP_OFFSET}px`, left: `${left}px`, transform: "none" };
    } else if (spaceRight >= TOOLTIP_WIDTH + 32) {
      return { left: `${targetRect.x + targetRect.width + TOOLTIP_OFFSET}px`, top: `${Math.max(16, targetCenterY - 120)}px`, transform: "none" };
    } else {
      return { right: `${w - targetRect.x + TOOLTIP_OFFSET}px`, top: `${Math.max(16, targetCenterY - 120)}px`, transform: "none" };
    }
  }, [targetRect, isFull, isMobile]);

  if (!active || !step) return null;

  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <>
      {/* SVG Mask */}
      <svg
        className="fixed inset-0 z-[1000] pointer-events-none"
        width="100%"
        height="100%"
        style={{ width: "100vw", height: "100vh" }}
      >
        <path d={svgPath} fillRule="evenodd" fill="rgba(0,0,0,0.65)" />
      </svg>

      {/* Click-through backdrop to capture clicks outside tooltip (close on outside click is optional; we don't close) */}
      <div className="fixed inset-0 z-[1001] pointer-events-none" />

      {/* Tooltip Card */}
      <div
        className="fixed z-[1002] bg-white rounded-xl border border-[#E8E8E8] shadow-2xl p-5 pointer-events-auto"
        style={isMobile ? tooltipPosition : { ...tooltipPosition, width: `${TOOLTIP_WIDTH}px`, maxWidth: "calc(100vw - 32px)" }}
      >
        {/* Progress */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#999999] uppercase tracking-wider font-medium">
              步骤 {currentStep + 1} / {totalSteps}
            </span>
            <div className="flex gap-0.5">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-4 rounded-full transition-colors ${
                    i <= currentStep ? "bg-[#111111]" : "bg-[#E8E8E8]"
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={end}
            className="text-[#999999] hover:text-[#111111] transition-colors"
            aria-label="关闭导览"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-[#111111] font-semibold text-base mb-2">{step.title}</h3>

        {/* Description */}
        <p className="text-[#555555] text-sm leading-relaxed mb-5 whitespace-pre-line">
          {step.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isFirst && (
            <button
              onClick={prev}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-[#999999] hover:text-[#111111] hover:bg-[#F7F7F7] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              上一步
            </button>
          )}
          <div className="flex-1" />
          {!isLast && (
            <button
              onClick={skip}
              className="px-3 py-1.5 rounded-lg text-xs text-[#999999] hover:text-[#111111] transition-colors"
            >
              跳过
            </button>
          )}
          <button
            onClick={next}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs bg-[#111111] hover:bg-[#333333] text-white transition-colors font-medium"
          >
            {isLast ? "开始探索" : isFirst ? "开始导览" : "下一步"}
            {!isLast && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </>
  );
}
