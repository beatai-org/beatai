// Single source of truth for every book in the site.
//
// A book is a tree of articles defined by a `_meta.json` file. The URL is
// derived (not stored): see getBookBasePath in ./index.js. Collections (which
// book groups belong to a hub) are declared in ./collections.js.
//
// To add a new book: append an entry here, drop a `_meta.json` and articles
// under the metaFile's directory, and (optionally) add the book id to a
// collection's bookIds. Per-article tabs / embedded components are declared
// in the `_meta.json` item — see public/docs/llc-content/_meta.json for an
// example combining 4-tab UI, hero visualizations, and inline doc-components.

export const BOOKS = Object.freeze([
  {
    id: 'ai-insights',
    slug: 'ai-insights',
    title: 'AI 前沿学习',
    bookTitle: 'AI 前沿学习',
    description: 'AI 前沿学习，模拟各种明星角色，给大家不一样的学习体验。',
    metaFile: '/docs/ai-insights/_meta.json',
    defaultEntry: ''
  },
  {
    id: 'rust-course',
    slug: 'rust-course',
    title: 'RUST 语言圣经',
    bookTitle: 'RUST 语言圣经',
    description: 'Rust 编程语言完整学习指南。',
    metaFile: '/docs/rust-course/_meta.json',
    defaultEntry: 'about-book',
    githubRepo: 'https://github.com/sunface/rust-course',
    repoTitle: '繁星点点，只因有你'
  },
  {
    id: 'learn-claude-code',
    slug: 'learn-claude-code',
    title: 'Learn Claude Code',
    bookTitle: 'Learn Claude Code',
    description: '从零手搓 Claude Code 与最佳实践内容，覆盖学习路径、版本拆解、源码讲解与实践经验。',
    metaFile: '/docs/llc-content/_meta.json',
    defaultEntry: 'preface',
    githubRepo: 'https://github.com/shareAI-lab/learn-claude-code',
    repoTitle: 'shareAI-lab / learn-claude-code',
    cardLabel: '已上线',
    cardMeta: '1 本教程书',
    cardCta: '进入阅读',
    mdxComponents: () => import('./books/learn-claude-code/mdxComponents')
  },
  {
    id: 'deep-learning',
    slug: 'deep-learning',
    title: '深度学习指南',
    bookTitle: '深度学习指南',
    description: '从线性代数、微积分、概率统计一路走到 CNN、RNN、Transformer、GPT、Llama 与 DeepSeek。',
    metaFile: '/docs/learn-ai/deep-learning/_meta.json',
    defaultEntry: 'chapter-01/lesson-01',
    cardLabel: '新收录',
    cardMeta: '18 个章节',
    cardCta: '开始学习'
  },
  {
    id: 'agent-harness',
    slug: 'agent-harness',
    title: 'Agent Harness',
    bookTitle: 'Agent Harness',
    description: 'Agent Harness 实战手册：拆解 Claude Code / Cursor 等代理产品背后那层「壳」是怎么调度模型、工具、上下文与权限的。',
    metaFile: '/docs/learn-ai/agent-harness/_meta.json',
    defaultEntry: 'chapter-01/lesson-01',
    cardLabel: '新收录',
    cardMeta: '1 篇示例文章',
    cardCta: '开始阅读'
  },
  {
    id: 'elon-book',
    slug: 'elon-book',
    title: '埃隆之书',
    bookTitle: '埃隆之书',
    description: '目标与成功指南，基于埃隆·马斯克原话整理的中文书籍版 Docs。',
    metaFile: '/docs/mba/elon-book/_meta.json',
    defaultEntry: 'about',
    cardLabel: '已上线',
    cardMeta: '若干篇章',
    cardCta: '开始阅读'
  }
]);
