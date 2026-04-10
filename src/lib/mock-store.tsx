"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import accountsData from "@/data/accounts.json";
import personasData from "@/data/personas.json";
import autopostData from "@/data/autopost.json";
import sourcesData from "@/data/sources.json";
import tweetPreviewsData from "@/data/tweet-previews.json";
import groupsData from "@/data/groups.json";
import templatesData from "@/data/persona-templates.json";
import monitoringData from "@/data/monitoring.json";
import draftsData from "@/data/drafts.json";
import engagementConfigsData from "@/data/engagement-configs.json";
import engagementLogsData from "@/data/engagement-logs.json";
import notificationsData from "@/data/notifications.json";

export interface Account {
  id: string;
  handle: string;
  displayName: string;
  avatarSeed: string;
  followersCount: number;
  followingCount: number;
  tweetsCount: number;
  active: boolean;
  createdAt: string;
  groupId?: string;
}

export interface Group {
  id: string;
  name: string;
  color: string;
}

export interface Persona {
  gender: string;
  nationality: string;
  age: number;
  interests: string[];
  personalityTraits: string[];
  writingStyle: string;
  bio: string;
  distillationSampleTweets: string;
}

export interface PersonaTemplate {
  id: string;
  name: string;
  description: string;
  persona: Persona;
}

export interface AutopostConfig {
  enabled: boolean;
  frequency: string;
  scheduledTimes: string[];
  activeDays: string[];
  tone: string;
  topics: string[];
  avoidTopics: string[];
  includeHashtags: boolean;
  includeEmojis: boolean;
}

export interface Source {
  id: string;
  name: string;
  url: string;
  type: "rss" | "website" | "twitter" | "youtube" | "substack" | "telegram";
  active: boolean;
  lastFetched: string;
}

export interface MonitoringMessage {
  id: string;
  accountId: string;
  accountHandle: string;
  sender: string;
  senderAvatar: string;
  category: "collab" | "commerce" | "spam" | "normal";
  categoryLabel: string;
  preview: string;
  content: string;
  receivedAt: string;
  read: boolean;
}

export interface Draft {
  id: string;
  accountId: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  scheduledTime: string;
  generatedAt: string;
  topic: string;
}

export interface EngagementRule {
  type: string;
  value: string;
}

export interface AutoFollowConfig {
  enabled: boolean;
  maxPerDay: number;
  rules: EngagementRule[];
}

export interface AutoRetweetConfig {
  enabled: boolean;
  maxPerDay: number;
  minLikes: number;
  whitelist: string[];
  keywords: string[];
  delayMin: number;
  delayMax: number;
  quoteTweetEnabled: boolean;
}

export interface AutoCommentConfig {
  enabled: boolean;
  maxPerDay: number;
  targets: string[];
  style: string;
  mode: string;
}

export interface AutoReplyConfig {
  enabled: boolean;
  maxPerDay: number;
  triggerTypes: string[];
  onlyFollowers: boolean;
  keywords: string[];
  style: string;
}

export interface EngagementConfig {
  autoFollow: AutoFollowConfig;
  autoRetweet: AutoRetweetConfig;
  autoComment: AutoCommentConfig;
  autoReply: AutoReplyConfig;
}

export interface EngagementLog {
  id: string;
  accountId: string;
  type: "follow" | "retweet" | "comment" | "reply";
  targetHandle: string;
  targetName?: string;
  tweetExcerpt?: string;
  commentText?: string;
  replyText?: string;
  at: string;
}

export interface Notification {
  id: string;
  type: "post" | "message" | "health" | "action" | "engagement";
  text: string;
  at: string;
  read: boolean;
  link?: string;
}

export interface TrendingTopic {
  topic: string;
  heat: number;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarSeed: string;
  lastActive: string;
}

export interface HealthScore {
  score: number;
  breakdown: Array<{ label: string; value: number; max: number }>;
  risk: "low" | "medium" | "high";
}

export const DEFAULT_ENGAGEMENT_CONFIG: EngagementConfig = {
  autoFollow: { enabled: false, maxPerDay: 15, rules: [] },
  autoRetweet: { enabled: false, maxPerDay: 3, minLikes: 1000, whitelist: [], keywords: [], delayMin: 30, delayMax: 120, quoteTweetEnabled: false },
  autoComment: { enabled: false, maxPerDay: 5, targets: [], style: "supportive", mode: "latest" },
  autoReply: { enabled: false, maxPerDay: 30, triggerTypes: ["mention", "reply"], onlyFollowers: false, keywords: [], style: "grateful" },
};

const TRENDING_TOPICS: TrendingTopic[] = [
  { topic: "Bitcoin ETF 资金流入", heat: 98, category: "加密" },
  { topic: "Claude Sonnet 4.6 发布", heat: 94, category: "AI" },
  { topic: "Layer 2 扩容进展", heat: 87, category: "加密" },
  { topic: "美联储 5 月降息预期", heat: 85, category: "财经" },
  { topic: "Llama 4 开源动态", heat: 82, category: "AI" },
  { topic: "Solana TPS 新纪录", heat: 78, category: "加密" },
  { topic: "AI 代理 Agent 范式", heat: 75, category: "AI" },
  { topic: "纳指突破历史高点", heat: 72, category: "财经" },
  { topic: "RAG vs 微调讨论", heat: 68, category: "AI" },
  { topic: "DeFi 再质押赛道", heat: 65, category: "加密" },
];

const TEAM_MEMBERS: TeamMember[] = [
  { id: "mem_001", name: "Raye Chen", email: "raye@smartkols.io", role: "Owner", avatarSeed: "naval", lastActive: "2 分钟前" },
  { id: "mem_002", name: "Alex Wang", email: "alex@smartkols.io", role: "Admin", avatarSeed: "sama", lastActive: "1 小时前" },
  { id: "mem_003", name: "Jenny Liu", email: "jenny@smartkols.io", role: "Editor", avatarSeed: "karpathy", lastActive: "3 小时前" },
  { id: "mem_004", name: "Mike Zhang", email: "mike@smartkols.io", role: "Editor", avatarSeed: "pmarca", lastActive: "昨天" },
  { id: "mem_005", name: "Sarah Kim", email: "sarah@smartkols.io", role: "Viewer", avatarSeed: "benedictevans", lastActive: "2 天前" },
];

interface MockStore {
  accounts: Account[];
  groups: Group[];
  personas: Record<string, Persona>;
  personaTemplates: PersonaTemplate[];
  autopostConfigs: Record<string, AutopostConfig>;
  sources: Record<string, Source[]>;
  tweetPreviews: Record<string, string[]>;
  monitoringMessages: MonitoringMessage[];
  drafts: Draft[];
  engagementConfigs: Record<string, EngagementConfig>;
  engagementLogs: EngagementLog[];
  notifications: Notification[];
  trendingTopics: TrendingTopic[];
  teamMembers: TeamMember[];
  hydrated: boolean;
  addAccount: (account: Account) => void;
  addAccounts: (accounts: Account[]) => void;
  deleteAccount: (id: string) => void;
  deleteAccounts: (ids: string[]) => void;
  updatePersona: (id: string, persona: Persona) => void;
  applyTemplateToAccounts: (ids: string[], templateId: string) => void;
  updateAutopost: (id: string, config: AutopostConfig) => void;
  applyAutopostToAccounts: (ids: string[], config: Partial<AutopostConfig>) => void;
  addSource: (accountId: string, source: Source) => void;
  addSourcesToAccounts: (ids: string[], sources: Source[]) => void;
  deleteSource: (accountId: string, sourceId: string) => void;
  toggleSourceActive: (accountId: string, sourceId: string) => void;
  addGroup: (group: Group) => void;
  moveAccountsToGroup: (ids: string[], groupId: string) => void;
  markMessageRead: (id: string) => void;
  randomizePersonas: (ids: string[]) => void;
  approveDraft: (id: string) => void;
  rejectDraft: (id: string) => void;
  regenerateDraft: (id: string) => void;
  editDraft: (id: string, content: string) => void;
  addDraftsFromTopic: (topic: string) => void;
  getEngagementConfig: (accountId: string) => EngagementConfig;
  updateEngagementConfig: (accountId: string, config: EngagementConfig) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Omit<Notification, "id" | "at" | "read">) => void;
  getHealthScore: (accountId: string) => HealthScore;
  resetDemo: () => void;
}

const MockStoreContext = createContext<MockStore | null>(null);

const STORAGE_KEY = "smartkols_state_v1";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value));
  } catch {}
}

function hashString(s: string): number {
  return s.split("").reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0);
}

export function MockStoreProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(accountsData as Account[]);
  const [groups, setGroups] = useState<Group[]>(groupsData as Group[]);
  const [personas, setPersonas] = useState<Record<string, Persona>>(personasData as Record<string, Persona>);
  const personaTemplates = templatesData as PersonaTemplate[];
  const [autopostConfigs, setAutopostConfigs] = useState<Record<string, AutopostConfig>>(autopostData as Record<string, AutopostConfig>);
  const [sources, setSources] = useState<Record<string, Source[]>>(sourcesData as Record<string, Source[]>);
  const tweetPreviews = tweetPreviewsData as Record<string, string[]>;
  const [monitoringMessages, setMonitoringMessages] = useState<MonitoringMessage[]>(monitoringData as MonitoringMessage[]);
  const [drafts, setDrafts] = useState<Draft[]>(draftsData as Draft[]);
  const [engagementConfigs, setEngagementConfigs] = useState<Record<string, EngagementConfig>>(engagementConfigsData as Record<string, EngagementConfig>);
  const [engagementLogs, setEngagementLogs] = useState<EngagementLog[]>(engagementLogsData as EngagementLog[]);
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData as Notification[]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once on mount (client only)
  useEffect(() => {
    setAccounts(loadFromStorage("accounts", accountsData as Account[]));
    setGroups(loadFromStorage("groups", groupsData as Group[]));
    setPersonas(loadFromStorage("personas", personasData as Record<string, Persona>));
    setAutopostConfigs(loadFromStorage("autopostConfigs", autopostData as Record<string, AutopostConfig>));
    setSources(loadFromStorage("sources", sourcesData as Record<string, Source[]>));
    setMonitoringMessages(loadFromStorage("monitoringMessages", monitoringData as MonitoringMessage[]));
    setDrafts(loadFromStorage("drafts", draftsData as Draft[]));
    setEngagementConfigs(loadFromStorage("engagementConfigs", engagementConfigsData as Record<string, EngagementConfig>));
    setEngagementLogs(loadFromStorage("engagementLogs", engagementLogsData as EngagementLog[]));
    setNotifications(loadFromStorage("notifications", notificationsData as Notification[]));
    setHydrated(true);
  }, []);

  // Persist to localStorage when state changes
  useEffect(() => { if (hydrated) saveToStorage("accounts", accounts); }, [accounts, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("groups", groups); }, [groups, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("personas", personas); }, [personas, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("autopostConfigs", autopostConfigs); }, [autopostConfigs, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("sources", sources); }, [sources, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("monitoringMessages", monitoringMessages); }, [monitoringMessages, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("drafts", drafts); }, [drafts, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("engagementConfigs", engagementConfigs); }, [engagementConfigs, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("engagementLogs", engagementLogs); }, [engagementLogs, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("notifications", notifications); }, [notifications, hydrated]);

  const addAccount = (account: Account) => setAccounts((p) => [...p, account]);
  const addAccounts = (newAccounts: Account[]) => setAccounts((p) => [...p, ...newAccounts]);
  const deleteAccount = (id: string) => setAccounts((p) => p.filter((a) => a.id !== id));
  const deleteAccounts = (ids: string[]) => setAccounts((p) => p.filter((a) => !ids.includes(a.id)));

  const updatePersona = (id: string, persona: Persona) =>
    setPersonas((p) => ({ ...p, [id]: persona }));

  const applyTemplateToAccounts = (ids: string[], templateId: string) => {
    const template = personaTemplates.find((t) => t.id === templateId);
    if (!template) return;
    setPersonas((p) => {
      const updated = { ...p };
      ids.forEach((id) => { updated[id] = { ...template.persona }; });
      return updated;
    });
  };

  const updateAutopost = (id: string, config: AutopostConfig) =>
    setAutopostConfigs((p) => ({ ...p, [id]: config }));

  const applyAutopostToAccounts = (ids: string[], config: Partial<AutopostConfig>) => {
    setAutopostConfigs((p) => {
      const updated = { ...p };
      ids.forEach((id) => { updated[id] = { ...(updated[id] || {}), ...config } as AutopostConfig; });
      return updated;
    });
  };

  const addSource = (accountId: string, source: Source) =>
    setSources((p) => ({ ...p, [accountId]: [...(p[accountId] || []), source] }));

  const addSourcesToAccounts = (ids: string[], newSources: Source[]) => {
    setSources((p) => {
      const updated = { ...p };
      ids.forEach((id) => {
        const existing = updated[id] || [];
        const toAdd = newSources.filter((s) => !existing.find((e) => e.url === s.url));
        updated[id] = [...existing, ...toAdd.map((s) => ({ ...s, id: `src_${Date.now()}_${Math.random()}` }))];
      });
      return updated;
    });
  };

  const deleteSource = (accountId: string, sourceId: string) =>
    setSources((p) => ({ ...p, [accountId]: (p[accountId] || []).filter((s) => s.id !== sourceId) }));

  const toggleSourceActive = (accountId: string, sourceId: string) =>
    setSources((p) => ({
      ...p,
      [accountId]: (p[accountId] || []).map((s) => s.id === sourceId ? { ...s, active: !s.active } : s),
    }));

  const addGroup = (group: Group) => setGroups((p) => [...p, group]);

  const moveAccountsToGroup = (ids: string[], groupId: string) =>
    setAccounts((p) => p.map((a) => ids.includes(a.id) ? { ...a, groupId } : a));

  const markMessageRead = (id: string) =>
    setMonitoringMessages((p) => p.map((m) => m.id === id ? { ...m, read: true } : m));

  const INTERESTS_POOL = ["区块链","DeFi","NFT","人工智能","Web3","科技创业","量化交易","元宇宙","开源软件","产品设计","加密货币","机器学习","创业投资","数字资产","去中心化金融","智能合约","Layer2","跨链桥","预言机","DAO治理"];
  const TRAITS_POOL = ["直率","幽默","理性分析","敢于预测","思维开阔","数据驱动","善于总结","逻辑严密","观点鲜明","乐于分享","批判性思维","长期主义","敢说真话","反传统","独立研究"];
  const STYLES_POOL = ["短句直击要害","善用数据支撑观点","喜欢用反问句","引用权威观点","分点列举","故事化叙述","直接给结论","用比喻解释复杂概念","先抛结论再论证","加入个人亲身经历"];
  const NATIONALITIES = ["中国","美国","日本","新加坡","英国","德国","韩国","加拿大","澳大利亚","香港"];
  const GENDERS = ["male","female","non-binary"];

  const randomizePersonas = (ids: string[]) => {
    setPersonas((p) => {
      const updated = { ...p };
      ids.forEach((id) => {
        const shuffledInterests = [...INTERESTS_POOL].sort(() => Math.random() - 0.5);
        const shuffledTraits = [...TRAITS_POOL].sort(() => Math.random() - 0.5);
        updated[id] = {
          gender: GENDERS[Math.floor(Math.random() * GENDERS.length)],
          nationality: NATIONALITIES[Math.floor(Math.random() * NATIONALITIES.length)],
          age: Math.floor(Math.random() * 24) + 22,
          interests: shuffledInterests.slice(0, 3),
          personalityTraits: shuffledTraits.slice(0, 4),
          writingStyle: STYLES_POOL[Math.floor(Math.random() * STYLES_POOL.length)],
          bio: "",
          distillationSampleTweets: "",
        };
      });
      return updated;
    });
  };

  const approveDraft = (id: string) =>
    setDrafts((p) => p.map((d) => d.id === id ? { ...d, status: "approved" } : d));

  const rejectDraft = (id: string) =>
    setDrafts((p) => p.map((d) => d.id === id ? { ...d, status: "rejected" } : d));

  const regenerateDraft = (id: string) =>
    setDrafts((p) => p.map((d) => {
      if (d.id !== id) return d;
      const variations = [
        "（重新生成）" + d.content.slice(0, 30) + "... 以另一个角度切入。",
        "换个角度思考：" + d.content.slice(0, 40) + "。",
        d.content.split("。")[0] + "。深入一点说，背后的机制其实更有意思。",
      ];
      return { ...d, content: variations[Math.floor(Math.random() * variations.length)], generatedAt: new Date().toISOString() };
    }));

  const editDraft = (id: string, content: string) =>
    setDrafts((p) => p.map((d) => d.id === id ? { ...d, content } : d));

  const addDraftsFromTopic = (topic: string) => {
    const picks = accounts.slice(0, 5);
    const newDrafts: Draft[] = picks.map((a, i) => ({
      id: `draft_${Date.now()}_${i}`,
      accountId: a.id,
      content: `关于"${topic}"：这是 AI 根据该话题和账号 persona 生成的草稿内容占位。实际实现时会调用 Claude API。`,
      status: "pending",
      scheduledTime: new Date(Date.now() + (i + 1) * 3600 * 1000).toISOString(),
      generatedAt: new Date().toISOString(),
      topic,
    }));
    setDrafts((p) => [...newDrafts, ...p]);
  };

  const getEngagementConfig = (accountId: string): EngagementConfig => {
    return engagementConfigs[accountId] || DEFAULT_ENGAGEMENT_CONFIG;
  };

  const updateEngagementConfig = (accountId: string, config: EngagementConfig) =>
    setEngagementConfigs((p) => ({ ...p, [accountId]: config }));

  const markNotificationRead = (id: string) =>
    setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));

  const markAllNotificationsRead = () =>
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));

  const addNotification = (n: Omit<Notification, "id" | "at" | "read">) =>
    setNotifications((p) => [{ ...n, id: `notif_${Date.now()}`, at: new Date().toISOString(), read: false }, ...p]);

  const getHealthScore = (accountId: string): HealthScore => {
    const h = hashString(accountId);
    const postingFreq = 10 + (h % 16);  // 10-25
    const engagement = 10 + ((h * 3) % 16);
    const consistency = 10 + ((h * 7) % 16);
    const risk = 10 + ((h * 11) % 16);
    const score = Math.min(100, postingFreq + engagement + consistency + risk);
    const riskLevel: "low" | "medium" | "high" = score >= 80 ? "low" : score >= 60 ? "medium" : "high";
    return {
      score,
      breakdown: [
        { label: "发帖频率稳定性", value: postingFreq, max: 25 },
        { label: "互动率", value: engagement, max: 25 },
        { label: "内容一致性", value: consistency, max: 25 },
        { label: "风险信号", value: risk, max: 25 },
      ],
      risk: riskLevel,
    };
  };

  const resetDemo = () => {
    if (typeof window === "undefined") return;
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_KEY));
    keys.forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <MockStoreContext.Provider value={{
      accounts, groups, personas, personaTemplates, autopostConfigs,
      sources, tweetPreviews, monitoringMessages,
      drafts, engagementConfigs, engagementLogs, notifications,
      trendingTopics: TRENDING_TOPICS, teamMembers: TEAM_MEMBERS, hydrated,
      addAccount, addAccounts, deleteAccount, deleteAccounts,
      updatePersona, applyTemplateToAccounts,
      updateAutopost, applyAutopostToAccounts,
      addSource, addSourcesToAccounts, deleteSource, toggleSourceActive,
      addGroup, moveAccountsToGroup, markMessageRead, randomizePersonas,
      approveDraft, rejectDraft, regenerateDraft, editDraft, addDraftsFromTopic,
      getEngagementConfig, updateEngagementConfig,
      markNotificationRead, markAllNotificationsRead, addNotification,
      getHealthScore, resetDemo,
    }}>
      {children}
    </MockStoreContext.Provider>
  );
}

export function useMockStore() {
  const ctx = useContext(MockStoreContext);
  if (!ctx) throw new Error("useMockStore must be used inside MockStoreProvider");
  return ctx;
}
