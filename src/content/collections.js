// A collection groups a set of books under a shared URL prefix and renders
// a hub page (card wall) at that prefix. Collections are entirely uniform —
// the only thing distinguishing one from another is its title/description
// and the list of book ids it contains.
//
// A book may belong to at most one collection. If a book has no collection,
// it lives at the top level (URL = /<book.slug>/...).

export const COLLECTIONS = Object.freeze([
  {
    id: 'learn-ai',
    slug: 'learn-ai',
    basePath: '/learn-ai',
    title: 'AI 学习教程',
    description: '集中浏览收录的 AI 学习教程，目前包含 Learn Claude Code、深度学习指南、Agent Harness。',
    bookIds: ['learn-claude-code', 'deep-learning', 'agent-harness']
  },
  {
    id: 'mba',
    slug: 'mba',
    basePath: '/mba',
    title: '组织管理教程',
    description: '组织、管理、领导力相关的书籍合集；首批收录《埃隆之书》。',
    bookIds: ['elon-book']
  }
]);
