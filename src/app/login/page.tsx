"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, Zap, Shield, Users } from "lucide-react";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = (provider: string) => {
    setLoading(provider);
    if (typeof window !== "undefined") {
      localStorage.setItem("smartkols_logged_in", "1");
    }
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-[#F7F7F7] flex items-center justify-center p-4 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full bg-white rounded-2xl shadow-xl border border-[#E8E8E8] overflow-hidden">
        {/* Left: Brand */}
        <div className="p-10 md:p-12 bg-gradient-to-br from-[#111111] to-[#333333] text-white flex flex-col">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#111111] text-sm font-black">
              SK
            </div>
            <span className="text-lg font-semibold tracking-tight">SmartKOLs</span>
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-4">
            AI 驱动的<br />Twitter KOL 矩阵管理
          </h1>
          <p className="text-white/60 text-sm mb-10">
            一个后台，管理数百个 Twitter 账号 —— 从人格配置、内容生产到自动互动，全流程 AI 驱动。
          </p>

          <div className="space-y-4 mt-auto">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-white/80 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">独立人格 · 内容智能生成</p>
                <p className="text-white/50 text-xs">每个账号独立 persona，内容风格可定制</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-4 h-4 text-white/80 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">互动自动化</p>
                <p className="text-white/50 text-xs">自动关注、转发、评论、回复 —— 看起来像真人</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-white/80 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">账号健康监控</p>
                <p className="text-white/50 text-xs">频率限制、风险评分、异常预警</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-white/80 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">200+ 账号批量管理</p>
                <p className="text-white/50 text-xs">分组、批量操作、团队协作</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Login */}
        <div className="p-10 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-[#111111] mb-2">欢迎回来</h2>
          <p className="text-[#999999] text-sm mb-8">登录以继续访问你的 KOL 矩阵控制台</p>

          <div className="space-y-3">
            <button
              onClick={() => handleLogin("github")}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-[#E8E8E8] bg-white hover:bg-[#F7F7F7] text-[#111111] text-sm font-medium transition-colors disabled:opacity-50"
            >
              <GithubIcon />
              {loading === "github" ? "登录中..." : "使用 GitHub 登录"}
            </button>
            <button
              onClick={() => handleLogin("google")}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-[#E8E8E8] bg-white hover:bg-[#F7F7F7] text-[#111111] text-sm font-medium transition-colors disabled:opacity-50"
            >
              <GoogleIcon />
              {loading === "google" ? "登录中..." : "使用 Google 登录"}
            </button>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E8E8E8]" />
            <span className="text-xs text-[#999999]">或者</span>
            <div className="flex-1 h-px bg-[#E8E8E8]" />
          </div>

          <button
            onClick={() => handleLogin("demo")}
            disabled={loading !== null}
            className="w-full px-4 py-3 rounded-lg bg-[#111111] hover:bg-[#333333] text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading === "demo" ? "进入中..." : "直接体验 Demo"}
          </button>

          <p className="text-xs text-[#999999] text-center mt-8">
            登录即表示你同意我们的<span className="underline cursor-pointer"> 服务条款 </span>和<span className="underline cursor-pointer"> 隐私政策 </span>
          </p>
        </div>
      </div>
    </div>
  );
}
