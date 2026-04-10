"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import accountsData from "@/data/accounts.json";
import personasData from "@/data/personas.json";
import autopostData from "@/data/autopost.json";
import sourcesData from "@/data/sources.json";
import tweetPreviewsData from "@/data/tweet-previews.json";
import groupsData from "@/data/groups.json";
import templatesData from "@/data/persona-templates.json";
import monitoringData from "@/data/monitoring.json";

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

interface MockStore {
  accounts: Account[];
  groups: Group[];
  personas: Record<string, Persona>;
  personaTemplates: PersonaTemplate[];
  autopostConfigs: Record<string, AutopostConfig>;
  sources: Record<string, Source[]>;
  tweetPreviews: Record<string, string[]>;
  monitoringMessages: MonitoringMessage[];
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
}

const MockStoreContext = createContext<MockStore | null>(null);

export function MockStoreProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(accountsData as Account[]);
  const [groups, setGroups] = useState<Group[]>(groupsData as Group[]);
  const [personas, setPersonas] = useState<Record<string, Persona>>(personasData as Record<string, Persona>);
  const personaTemplates = templatesData as PersonaTemplate[];
  const [autopostConfigs, setAutopostConfigs] = useState<Record<string, AutopostConfig>>(autopostData as Record<string, AutopostConfig>);
  const [sources, setSources] = useState<Record<string, Source[]>>(sourcesData as Record<string, Source[]>);
  const tweetPreviews = tweetPreviewsData as Record<string, string[]>;
  const [monitoringMessages, setMonitoringMessages] = useState<MonitoringMessage[]>(monitoringData as MonitoringMessage[]);

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

  return (
    <MockStoreContext.Provider value={{
      accounts, groups, personas, personaTemplates, autopostConfigs,
      sources, tweetPreviews, monitoringMessages,
      addAccount, addAccounts, deleteAccount, deleteAccounts,
      updatePersona, applyTemplateToAccounts,
      updateAutopost, applyAutopostToAccounts,
      addSource, addSourcesToAccounts, deleteSource, toggleSourceActive,
      addGroup, moveAccountsToGroup, markMessageRead, randomizePersonas,
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
