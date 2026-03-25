export const DEFAULT_LEARN_AI_SPACE_SLUG = 'learn-claude-code';

export const LEARN_AI_SPACES = [
  {
    id: 'learn-claude-code',
    slug: 'learn-claude-code',
    title: 'Learn Claude Code',
    bookTitle: 'Learn Claude Code',
    contentSource: 'lcc',
    description: '收录从零手搓 Claude Code 与最佳实践内容，覆盖学习路径、版本拆解、源码讲解与实践经验。',
    cardLabel: '已上线',
    cardMeta: '1 本教程书',
    cardCta: '进入阅读',
    sidebarKind: 'layered',
    defaultEntry: 'preface',
    layerIds: ['introduction', 'tools', 'planning', 'memory', 'concurrency', 'collaboration', 'best-practices'],
    sectionGroups: [
      {
        title: '从零手搓 Claude Code',
        layerIds: ['introduction', 'tools', 'planning', 'memory', 'concurrency', 'collaboration']
      },
      {
        title: '最佳实践',
        versionIds: ['bp01']
      }
    ],
    versionIds: ['preface', 's01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10', 's11', 's12', 'bp01']
  },
  {
    id: 'deep-learning',
    slug: 'deep-learning',
    title: '深度学习指南',
    bookTitle: '深度学习指南',
    contentSource: 'docs',
    docsMetaFile: '/docs/learn-ai/deep-learning/_meta.json',
    docsCategoryId: 'learn-ai/deep-learning',
    defaultPath: '/learn-ai/deep-learning/chapter-01/lesson-01',
    description: '从线性代数、微积分、概率统计一路走到 CNN、RNN、Transformer、GPT、Llama 与 DeepSeek。',
    cardLabel: '新收录',
    cardMeta: '18 个章节',
    cardCta: '开始学习'
  }
];

export function getDefaultLearnAiSpace() {
  return LEARN_AI_SPACES.find((space) => space.slug === DEFAULT_LEARN_AI_SPACE_SLUG) || LEARN_AI_SPACES[0] || null;
}

export function getLearnAiSpace(spaceSlug = '') {
  return LEARN_AI_SPACES.find((space) => space.slug === spaceSlug) || null;
}

export function getLearnAiSpaceByVersion(version = '') {
  return LEARN_AI_SPACES.find((space) => space.versionIds?.includes(version)) || null;
}

export function isLearnAiSpaceSlug(spaceSlug = '') {
  return Boolean(getLearnAiSpace(spaceSlug));
}
