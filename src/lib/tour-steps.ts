export interface TourStep {
  id: string;
  route: string;
  selector: string;
  title: string;
  description: string;
  highlight?: "full" | "default"; // full = highlight nothing, show centered modal (welcome/closing)
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    route: "/dashboard",
    selector: "[data-tour='dashboard-welcome']",
    title: "欢迎来到 SmartKOLs 👋",
    description:
      "这是一个人管理 200 个 Twitter KOL 账号的矩阵控制台。\n接下来 2 分钟，我会带你看完最值得关注的几个亮点。\n随时可以按 ESC 退出。",
    highlight: "full",
  },
  {
    id: "stats",
    route: "/dashboard",
    selector: "[data-tour='dashboard-stats']",
    title: "你的运营心跳",
    description:
      "200 个账号、总粉丝数、待审核草稿、今日自动互动 —— 所有关键指标压缩到这 6 张卡片，不用跳页面就能判断整体状态是否正常。",
  },
  {
    id: "trending",
    route: "/dashboard",
    selector: "[data-tour='trending-topics']",
    title: "让 AI 帮你想选题",
    description:
      "AI 从所有账号的信息源聚合出热门话题。点击任一话题 → 一键为矩阵批量生成相关草稿 —— 原本要策划半天的选题，现在 5 秒钟。",
  },
  {
    id: "groups",
    route: "/accounts",
    selector: "[data-tour='group-sidebar']",
    title: "200 个账号，5 个分组",
    description:
      "加密 50 · 科技 50 · AI 50 · 财经 30 · 网红 20 —— 每个分组可以独立管理、批量操作、套用统一人格模板。规模化不等于混乱，分组是矩阵管理的底层秩序。",
  },
  {
    id: "health",
    route: "/accounts",
    selector: "[data-tour='health-column']",
    title: "每个账号都有健康分",
    description:
      "看这一列彩色徽章 —— 每个账号一个 0-100 的健康分，综合发帖频率、互动率、内容一致性、风险信号 4 个维度。绿色健康、黄色注意、红色意味着有封号风险。矩阵管理最大的恐惧是'半夜醒来账号全挂了'，这个分就是第一道预警。",
  },
  {
    id: "persona",
    route: "/accounts/acc_001/persona",
    selector: "[data-tour='persona-form']",
    title: "每个账号都是一个独立'人'",
    description:
      "性别、国籍、年龄、兴趣、性格特征、写作风格、Bio —— 200 个账号就是 200 套独立的人格配置，不是复制粘贴。这就是为什么矩阵里的推文不会像群发的机器人。",
  },
  {
    id: "engagement",
    route: "/accounts/acc_001/engagement",
    selector: "[data-tour='engagement-cards']",
    title: "让账号'活起来' —— 最重要的一步 ⭐",
    description:
      "真人 KOL 不只发推。他们会主动关注感兴趣的人、转发好内容、评论大 V 的推文、回复粉丝的消息。SmartKOLs 为每个账号独立配置这 4 类行为，还带延迟随机化和频率限制 —— 这是矩阵账号和普通发推机器人的本质差别。",
  },
  {
    id: "engagement-log",
    route: "/accounts/acc_001/engagement",
    selector: "[data-tour='engagement-log']",
    title: "所有自动行为都有日志",
    description:
      "右边是这个账号近 7 天的真实互动记录 —— 什么时候关注了谁、转发了什么、在谁下面评论了什么。完全透明，任何异常行为你都能追溯到具体事件。",
  },
  {
    id: "drafts",
    route: "/drafts",
    selector: "[data-tour='drafts-list']",
    title: "AI 生产，你审核",
    description:
      "AI 生成的推文会先进这里。每条可以批准、编辑、重新生成或拒绝。批准的才进入发布排期。你对内容的最终掌控权一点没丢 —— AI 是副驾，你是驾驶员。",
  },
  {
    id: "calendar",
    route: "/calendar",
    selector: "[data-tour='week-grid']",
    title: "整个矩阵的发帖日历",
    description:
      "批准后的草稿 + 自动发帖配置 → 汇总到这个周视图。一眼看清接下来 7 天每个账号什么时候发什么，避免同主题账号同时段发同类内容。点击任一天展开完整排期。",
  },
  {
    id: "cmdk",
    route: "/dashboard",
    selector: "[data-tour='cmdk-button']",
    title: "最后一个技巧 —— Cmd+K",
    description:
      "按 ⌘K（Mac）或 Ctrl+K（Windows）打开命令面板。全局模糊搜索账号、草稿、消息，或者快速跳转到任意页面。200 个账号里找 'crypto' 就是一秒钟的事。",
  },
  {
    id: "closing",
    route: "/dashboard",
    selector: "[data-tour='dashboard-welcome']",
    title: "导览结束 —— 现在是你的舞台 🚀",
    description:
      "你看到了 SmartKOLs 的核心能力：规模 + 独立人格 + 互动自动化 + 风控 + 内容流水线。所有操作都会保留在浏览器里，想从头开始去 Settings → 重置 Demo 数据。左下角'导览'按钮可以随时重播本次介绍。",
    highlight: "full",
  },
];

export const TOUR_STORAGE_KEY = "smartkols_tour_seen";
