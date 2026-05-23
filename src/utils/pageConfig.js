import {
  LEARN_AI_BASE_PATH,
  LEGACY_LEARN_CLAUDE_CODE_BASE_PATH
} from './learnAiPaths';
import { SITE_CONFIG } from './siteConfig';

export const PAGE_IDS = Object.freeze({
  docs: 'docs',
  genesisLab: 'genesisLab',
  square: 'square',
  aiInsights: 'aiInsights',
  aiTutorials: 'aiTutorials',
  learnAiBook: 'learnAiBook',
  learnClaudeCode: 'learnClaudeCode',
  tag: 'tag',
  aiContinentDemo: 'aiContinentDemo',
  mapTextureShowcase: 'mapTextureShowcase',
  logoShowcase: 'logoShowcase',
  notFound: 'notFound'
});

export const PAGE_CONFIG = Object.freeze({
  [PAGE_IDS.docs]: {
    id: PAGE_IDS.docs,
    path: '/',
    title: SITE_CONFIG.seo.docsPageTitle,
    description: SITE_CONFIG.seo.docsDescription,
    navLabel: 'Documentation',
    footerLabel: 'Docs',
    ctaLabel: 'Get Started'
  },
  [PAGE_IDS.genesisLab]: {
    id: PAGE_IDS.genesisLab,
    path: '/genesis-lab',
    title: SITE_CONFIG.brandName,
    description: SITE_CONFIG.defaultDescription
  },
  [PAGE_IDS.square]: {
    id: PAGE_IDS.square,
    path: '/square',
    title: '广场',
    description: `${SITE_CONFIG.brandName} 社区广场 - 分享、交流与探索`
  },
  [PAGE_IDS.aiInsights]: {
    id: PAGE_IDS.aiInsights,
    path: SITE_CONFIG.routes.aiInsightsPath,
    categoryId: SITE_CONFIG.routes.aiInsightsCategoryId,
    title: 'AI 前沿学习',
    description: `${SITE_CONFIG.brandName} AI 前沿学习档案，集中浏览 AI 领域最新动态、技术分享与深度解析。`
  },
  [PAGE_IDS.aiTutorials]: {
    id: PAGE_IDS.aiTutorials,
    path: LEARN_AI_BASE_PATH,
    title: 'AI学习教程',
    description: `集中浏览 ${SITE_CONFIG.brandName} 收录的 AI学习教程，目前包含 Learn Claude Code，可直达书籍正文。`
  },
  [PAGE_IDS.learnAiBook]: {
    id: PAGE_IDS.learnAiBook,
    path: `${LEARN_AI_BASE_PATH}/:space/*`
  },
  [PAGE_IDS.learnClaudeCode]: {
    id: PAGE_IDS.learnClaudeCode,
    path: `${LEARN_AI_BASE_PATH}/learn-claude-code`,
    legacyPath: `${LEGACY_LEARN_CLAUDE_CODE_BASE_PATH}/*`,
    title: 'Learn Claude Code',
    description: `Learn Claude Code 学习路径已接入 ${SITE_CONFIG.brandName}，包含学习路径、版本详情、文档讲解、模拟器与源码浏览。`
  },
  [PAGE_IDS.tag]: {
    id: PAGE_IDS.tag,
    path: '/tags/:tagName',
    title: '# 标签',
    description: '浏览所有带有指定标签的文章。'
  },
  [PAGE_IDS.aiContinentDemo]: {
    id: PAGE_IDS.aiContinentDemo,
    path: '/ai-continent-demo',
    title: 'AI 大陆测试场',
    description: `${SITE_CONFIG.brandName} AI 大陆学习路径测试页：可视化展示地点、依赖关系与解锁流程。`
  },
  [PAGE_IDS.mapTextureShowcase]: {
    id: PAGE_IDS.mapTextureShowcase,
    path: '/map-texture-showcase',
    title: '游戏世界贴图测试页',
    description: `${SITE_CONFIG.brandName} 游戏世界贴图测试页，横向比较 10 张不同风格的世界地图素材。`
  },
  [PAGE_IDS.logoShowcase]: {
    id: PAGE_IDS.logoShowcase,
    path: '/logo-showcase',
    title: 'Logo 设计方案'
  },
  [PAGE_IDS.notFound]: {
    id: PAGE_IDS.notFound,
    title: '404',
    description: `${SITE_CONFIG.brandName} 404 页面 - 当前访问路径不存在`
  }
});

export const APP_ROUTE_PATHS = Object.freeze({
  root: '/',
  tags: PAGE_CONFIG[PAGE_IDS.tag].path,
  learnAiBook: PAGE_CONFIG[PAGE_IDS.learnAiBook].path,
  legacyLearnClaudeCode: PAGE_CONFIG[PAGE_IDS.learnClaudeCode].legacyPath,
  catchAll: '/*'
});

export const MARKETING_NAV_ITEMS = Object.freeze([
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'demo', label: 'Demo', href: '#demo' },
  {
    id: PAGE_IDS.docs,
    label: PAGE_CONFIG[PAGE_IDS.docs].navLabel,
    to: PAGE_CONFIG[PAGE_IDS.docs].path
  },
  { id: 'community', label: 'Community', href: '#community' }
]);

export const MARKETING_FOOTER_LINKS = Object.freeze([
  {
    id: PAGE_IDS.docs,
    label: PAGE_CONFIG[PAGE_IDS.docs].footerLabel,
    to: PAGE_CONFIG[PAGE_IDS.docs].path
  },
  { id: 'api', label: 'API', href: '#api' },
  {
    id: 'github',
    label: SITE_CONFIG.labels.github,
    href: SITE_CONFIG.links.githubOrgUrl,
    external: true
  },
  { id: 'blog', label: 'Blog', href: '#blog' }
]);

export const MARKETING_SOCIAL_LINKS = Object.freeze([
  {
    id: 'github',
    label: SITE_CONFIG.labels.github,
    href: SITE_CONFIG.links.githubOrgUrl,
    external: true
  },
  { id: 'twitter', label: 'Twitter', href: '#twitter' },
  { id: 'discord', label: 'Discord', href: '#discord' }
]);

export const SQUARE_CONTENT_CARDS = Object.freeze([
  {
    id: PAGE_IDS.aiInsights,
    icon: 'ai-insights',
    pathKind: 'category',
    categoryId: PAGE_CONFIG[PAGE_IDS.aiInsights].categoryId,
    title: 'AI 前沿分享',
    description: 'AI 领域最新动态、技术分享与深度解析'
  },
  {
    id: 'rustCourse',
    icon: 'rust-course',
    pathKind: 'category',
    categoryId: 'rust-course',
    title: 'RUST 语言圣经',
    description: '学习 AI 时代最安全的语言'
  },
  {
    id: PAGE_IDS.learnClaudeCode,
    icon: 'learn-ai',
    pathKind: 'learnAiDefault',
    title: PAGE_CONFIG[PAGE_IDS.learnClaudeCode].title,
    description: '欲练此功...'
  }
]);

export const SQUARE_TAGS = Object.freeze([
  'Rust',
  '基础',
  '进阶',
  '所有权',
  'AI',
  '入门',
  '数据类型',
  'Cargo'
]);

export function getPageConfig(pageId) {
  return PAGE_CONFIG[pageId];
}

export function getPagePath(pageId) {
  return getPageConfig(pageId)?.path || '/';
}

export function buildTagPath(tag) {
  return `/tags/${encodeURIComponent(tag)}`;
}
