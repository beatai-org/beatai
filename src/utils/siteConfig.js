const AI_INSIGHTS_CATEGORY_ID = 'ai-insights';
const AI_INSIGHTS_PATH = `/${AI_INSIGHTS_CATEGORY_ID}`;

export const SITE_CONFIG = {
  brandName: 'BeatAI',
  origin: 'https://beatai.org',
  defaultDescription: 'BeatAI - The AI that actually does things',
  routes: {
    aiInsightsCategoryId: AI_INSIGHTS_CATEGORY_ID,
    aiInsightsPath: AI_INSIGHTS_PATH
  },
  seo: {
    titleSuffix: 'BeatAI',
    docsTitleSuffix: 'BeatAI Docs',
    docsPageTitle: 'Documentation',
    docsDescription: 'Complete documentation for BeatAI - the open-source AI bot framework'
  },
  links: {
    githubOrgUrl: 'https://github.com/beatai-org',
    githubRepoUrl: 'https://github.com/beatai-org/BeatAI',
    githubDiscussionsUrl: 'https://github.com/beatai-org/BeatAI/discussions/categories/giscus',
    giscusOrigin: 'https://giscus.app'
  },
  labels: {
    github: 'GitHub',
    githubDiscussions: 'GitHub Discussions',
    selectBook: '选择书籍',
    terminalPrompt: 'beatai@web'
  },
  giscus: {
    default: {
      repo: process.env.REACT_APP_GISCUS_REPO || 'beatai-org/BeatAI',
      repoId: process.env.REACT_APP_GISCUS_REPO_ID || 'R_kgDOGmKA_Q',
      category: process.env.REACT_APP_GISCUS_CATEGORY || 'giscus',
      categoryId: process.env.REACT_APP_GISCUS_CATEGORY_ID || 'DIC_kwDOGmKA_c4COcYR',
      discussionsUrl: process.env.REACT_APP_GISCUS_DISCUSSIONS_URL ||
        'https://github.com/beatai-org/BeatAI/discussions/categories/giscus'
    },
    rustCourse: {
      repo: process.env.REACT_APP_RUST_COURSE_GISCUS_REPO || 'sunface/rust-course',
      repoId: process.env.REACT_APP_RUST_COURSE_GISCUS_REPO_ID || 'MDEwOlJlcG9zaXRvcnkxNDM4MjIwNjk=',
      category: process.env.REACT_APP_RUST_COURSE_GISCUS_CATEGORY || '章节评论区',
      categoryId: process.env.REACT_APP_RUST_COURSE_GISCUS_CATEGORY_ID || 'DIC_kwDOCJKM9c4COQcP',
      discussionsUrl: process.env.REACT_APP_RUST_COURSE_GISCUS_DISCUSSIONS_URL ||
        'https://github.com/sunface/rust-course/discussions/categories/%E7%AB%A0%E8%8A%82%E8%AF%84%E8%AE%BA%E5%8C%BA'
    }
  }
};

export function buildSiteTitle(title, suffix = SITE_CONFIG.seo.titleSuffix) {
  return title ? `${title} | ${suffix}` : suffix;
}

export function buildDocsTitle(title) {
  return buildSiteTitle(title, SITE_CONFIG.seo.docsTitleSuffix);
}

export function buildAbsoluteSiteUrl(pathname = '/') {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_CONFIG.origin}${normalizedPath}`;
}
