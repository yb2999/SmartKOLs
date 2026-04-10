"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMockStore } from "@/lib/mock-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Rss, Globe, AtSign, PlayCircle, BookOpen, Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SOURCE_TYPE_ICONS: Record<string, React.ReactNode> = {
  rss:      <Rss className="w-4 h-4" />,
  website:  <Globe className="w-4 h-4" />,
  twitter:  <AtSign className="w-4 h-4" />,
  youtube:  <PlayCircle className="w-4 h-4" />,
  substack: <BookOpen className="w-4 h-4" />,
  telegram: <Send className="w-4 h-4" />,
};

const SOURCE_TYPE_LABELS: Record<string, string> = {
  rss: "RSS", website: "网站", twitter: "Twitter", youtube: "YouTube", substack: "Substack", telegram: "Telegram",
};

const SOURCE_TYPE_COLORS: Record<string, string> = {
  rss: "text-[#999999] bg-black/5",
  website: "text-sky-400 bg-sky-900/20",
  twitter: "text-blue-400 bg-blue-900/20",
  youtube: "text-red-400 bg-red-900/20",
  substack: "text-orange-400 bg-orange-900/20",
  telegram: "text-cyan-400 bg-cyan-900/20",
};

const PRESET_CATALOG = [
  { category: "加密/Web3", color: "#C8922A", sources: [
    { name: "CoinDesk", url: "https://coindesk.com", type: "rss" as const, domain: "coindesk.com" },
    { name: "CoinTelegraph", url: "https://cointelegraph.com", type: "rss" as const, domain: "cointelegraph.com" },
    { name: "The Block", url: "https://theblock.co", type: "rss" as const, domain: "theblock.co" },
    { name: "Decrypt", url: "https://decrypt.co", type: "rss" as const, domain: "decrypt.co" },
  ]},
  { category: "科技", color: "#4A9EDB", sources: [
    { name: "TechCrunch", url: "https://techcrunch.com", type: "rss" as const, domain: "techcrunch.com" },
    { name: "Hacker News", url: "https://news.ycombinator.com", type: "rss" as const, domain: "ycombinator.com" },
    { name: "The Verge", url: "https://theverge.com", type: "rss" as const, domain: "theverge.com" },
    { name: "Product Hunt", url: "https://producthunt.com", type: "website" as const, domain: "producthunt.com" },
  ]},
  { category: "AI / 研究", color: "#4CAF7D", sources: [
    { name: "OpenAI Blog", url: "https://openai.com/blog", type: "website" as const, domain: "openai.com" },
    { name: "Anthropic Blog", url: "https://anthropic.com/news", type: "website" as const, domain: "anthropic.com" },
    { name: "Alignment Forum", url: "https://alignmentforum.org", type: "website" as const, domain: "alignmentforum.org" },
    { name: "arXiv CS.AI", url: "https://arxiv.org/list/cs.AI/recent", type: "rss" as const, domain: "arxiv.org" },
  ]},
];

export default function SourcesPage() {
  const params = useParams();
  const id = params.id as string;
  const { sources, addSource, deleteSource, toggleSourceActive } = useMockStore();
  const accountSources = sources[id] || [];
  const [showAdd, setShowAdd] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState<"rss" | "website" | "twitter" | "youtube" | "substack" | "telegram">("rss");

  const handleAdd = () => {
    if (!newName || !newUrl) return;
    addSource(id, { id: `src_${Date.now()}`, name: newName, url: newUrl, type: newType, active: true, lastFetched: new Date().toISOString() });
    setNewName(""); setNewUrl(""); setNewType("rss"); setShowAdd(false);
  };

  const addFromCatalog = (s: { name: string; url: string; type: "rss" | "website"; domain: string }) => {
    if (accountSources.find((a) => a.url === s.url)) return;
    addSource(id, { id: `src_${Date.now()}`, name: s.name, url: s.url, type: s.type, active: true, lastFetched: new Date().toISOString() });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">信息源管理</h2>
          <p className="text-[#999999] text-sm mt-1">配置该 KOL 监控的内容源，用于生成推文。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowCatalog(true)}>
            <Globe className="w-4 h-4 mr-1.5" />从预置库添加
          </Button>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 mr-1.5" />自定义添加
          </Button>
        </div>
      </div>

      {accountSources.length === 0 ? (
        <div className="text-center py-16 text-[#999999]">
          <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">还没有添加信息源</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={() => setShowCatalog(true)}>从预置库选择</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {accountSources.map((source) => {
            const typeColor = SOURCE_TYPE_COLORS[source.type] || "text-[#999999] bg-[#E8E8E8]";
            return (
              <div key={source.id} className="bg-white border border-[#E8E8E8] rounded-xl p-4 flex flex-col gap-3 hover:border-[#E0E0E0] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8E8E8] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${new URL(source.url.startsWith("http") ? source.url : `https://${source.url}`).hostname}&sz=64`}
                      alt=""
                      className="w-6 h-6"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = "none";
                        const parent = img.parentElement;
                        if (parent) parent.innerHTML = `<span class="text-[#999999]">${SOURCE_TYPE_ICONS[source.type] ? "" : "?"}</span>`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#111111] text-sm font-medium leading-tight">{source.name}</p>
                    <p className="text-[#999999] text-xs truncate mt-0.5">{source.url}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full", typeColor)}>
                    {SOURCE_TYPE_ICONS[source.type]}
                    {SOURCE_TYPE_LABELS[source.type]}
                  </span>
                  <div className="flex items-center gap-2">
                    <Switch checked={source.active} onCheckedChange={() => toggleSourceActive(id, source.id)} />
                    <button onClick={() => deleteSource(id, source.id)} className="text-[#999999] hover:text-red-400 transition-colors p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Source */}
      <Dialog open={showAdd} onOpenChange={(v) => !v && setShowAdd(false)}>
        <DialogContent>
          <DialogHeader><DialogTitle>自定义添加信息源</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#999999] mb-1.5 block">来源名称</label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="例如：TechCrunch" />
            </div>
            <div>
              <label className="text-xs text-[#999999] mb-1.5 block">URL 地址</label>
              <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs text-[#999999] mb-2 block">类型</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(SOURCE_TYPE_LABELS) as Array<keyof typeof SOURCE_TYPE_LABELS>).map((t) => (
                  <button key={t} onClick={() => setNewType(t as typeof newType)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border transition-colors", newType === t ? "border-[#CCCCCC] bg-black/5 text-[#111111]" : "border-[#E0E0E0] text-[#999999]")}>
                    {SOURCE_TYPE_ICONS[t]}{SOURCE_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowAdd(false)}>取消</Button>
              <Button onClick={handleAdd} disabled={!newName || !newUrl}>添加</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preset Catalog */}
      <Dialog open={showCatalog} onOpenChange={(v) => !v && setShowCatalog(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>预置信息源库</DialogTitle></DialogHeader>
          <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-1">
            {PRESET_CATALOG.map(({ category, color, sources: presets }) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <p className="text-xs text-[#999999] uppercase tracking-wider font-medium">{category}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((s) => {
                    const already = accountSources.some((a) => a.url === s.url);
                    return (
                      <div key={s.domain} className={cn("flex items-center gap-3 p-3 rounded-xl border transition-colors", already ? "bg-white border-[#E0E0E0] opacity-60" : "bg-white border-[#E8E8E8] hover:border-[#E0E0E0]")}>
                        <div className="w-9 h-9 rounded-lg bg-[#E8E8E8] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=64`} alt="" className="w-5 h-5" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#111111] text-xs font-medium">{s.name}</p>
                          <p className="text-[#999999] text-[10px] truncate">{s.domain}</p>
                        </div>
                        <button
                          onClick={() => addFromCatalog(s)}
                          disabled={already}
                          className={cn("flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors", already ? "text-[#00BA7C]" : "text-[#999999] hover:text-[#333333] hover:bg-[#E0E0E0]")}
                        >
                          {already ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => setShowCatalog(false)} className="mt-2">关闭</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
