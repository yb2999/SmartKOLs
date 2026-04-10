"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { TOUR_STEPS, TOUR_STORAGE_KEY } from "@/lib/tour-steps";

interface TourContextValue {
  active: boolean;
  currentStep: number;
  targetRect: DOMRect | null;
  totalSteps: number;
  start: () => void;
  end: () => void;
  next: () => void;
  prev: () => void;
  skip: () => void;
  hasSeenTour: boolean;
  markSeen: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [hasSeenTour, setHasSeenTour] = useState(true); // default true to avoid flash on SSR

  // Read tour seen flag on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(TOUR_STORAGE_KEY);
    setHasSeenTour(seen === "1");
  }, []);

  const markSeen = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOUR_STORAGE_KEY, "1");
    }
    setHasSeenTour(true);
  }, []);

  const start = useCallback(() => {
    setCurrentStep(0);
    setActive(true);
    markSeen();
  }, [markSeen]);

  const end = useCallback(() => {
    setActive(false);
    setTargetRect(null);
  }, []);

  const next = useCallback(() => {
    if (currentStep >= TOUR_STEPS.length - 1) {
      end();
      return;
    }
    setCurrentStep((s) => s + 1);
    setTargetRect(null);
  }, [currentStep, end]);

  const prev = useCallback(() => {
    if (currentStep <= 0) return;
    setCurrentStep((s) => s - 1);
    setTargetRect(null);
  }, [currentStep]);

  const skip = useCallback(() => {
    end();
  }, [end]);

  // Locate target element when step/route changes
  useEffect(() => {
    if (!active) return;
    const step = TOUR_STEPS[currentStep];

    // If route doesn't match, navigate
    if (pathname !== step.route) {
      router.push(step.route);
      return;
    }

    // Route matches — wait for DOM then find target
    let retry = 0;
    const tryLocate = () => {
      const el = document.querySelector(step.selector) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Wait for scroll to settle before measuring
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          setTargetRect(rect);
        }, 400);
      } else if (retry < 3) {
        retry++;
        setTimeout(tryLocate, 300);
      } else {
        // Give up — show tooltip centered
        setTargetRect(null);
      }
    };
    const initialTimer = setTimeout(tryLocate, 300);
    return () => clearTimeout(initialTimer);
  }, [active, currentStep, pathname, router]);

  // Recompute position on scroll/resize
  useEffect(() => {
    if (!active) return;
    const step = TOUR_STEPS[currentStep];
    const handleRecompute = () => {
      const el = document.querySelector(step.selector) as HTMLElement | null;
      if (el) setTargetRect(el.getBoundingClientRect());
    };
    window.addEventListener("resize", handleRecompute);
    window.addEventListener("scroll", handleRecompute, true);
    return () => {
      window.removeEventListener("resize", handleRecompute);
      window.removeEventListener("scroll", handleRecompute, true);
    };
  }, [active, currentStep]);

  // ESC to exit
  useEffect(() => {
    if (!active) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") end();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, end, next, prev]);

  return (
    <TourContext.Provider
      value={{
        active,
        currentStep,
        targetRect,
        totalSteps: TOUR_STEPS.length,
        start,
        end,
        next,
        prev,
        skip,
        hasSeenTour,
        markSeen,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used inside TourProvider");
  return ctx;
}
