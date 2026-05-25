// Cards shown on /square's "探索内容" grid. Each entry references either a
// book (URL = book's default page) or an explicit route (URL = href). Title
// and description are written here rather than pulled from the book so the
// square copy can stay marketing-flavoured.

export const SQUARE_CARDS = Object.freeze([
  {
    kind: 'route',
    icon: 'ai-insights',
    href: '/ai-insights',
    title: 'AI 前沿分享',
    description: 'AI 领域最新动态、技术分享与深度解析'
  },
  {
    kind: 'book',
    icon: 'rust-course',
    bookId: 'rust-course',
    title: 'RUST 语言圣经',
    description: '学习 AI 时代最安全的语言'
  },
  {
    kind: 'book',
    icon: 'learn-ai',
    bookId: 'learn-claude-code',
    title: 'Learn Claude Code',
    description: '欲练此功...'
  }
]);
