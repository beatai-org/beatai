import {
  findActiveCategoryByPath,
  getFirstNavigablePathForCategory
} from './docsMetaSelectors';
import { getLearnAiDefaultPath, LEARN_AI_BASE_PATH } from './learnAiPaths';
import { PAGE_CONFIG, PAGE_IDS } from './pageConfig';

export const AI_TUTORIALS_PATH = LEARN_AI_BASE_PATH;

export function getAiTutorialSpace() {
  return {
    id: 'ai-tutorials',
    title: PAGE_CONFIG[PAGE_IDS.aiTutorials].title,
    entryPath: AI_TUTORIALS_PATH,
    kind: 'tutorial-hub'
  };
}

export function getLearnAiHubSpace() {
  return {
    id: 'learn-ai',
    title: 'Learn Claude Code',
    entryPath: getLearnAiDefaultPath(),
    kind: 'learn-ai'
  };
}

function buildDocKnowledgeSpace(category) {
  if (!category) {
    return null;
  }

  return {
    id: category.id,
    title: category.title,
    entryPath: category.entryPath || getFirstNavigablePathForCategory(category),
    githubRepo: category.githubRepo,
    repoTitle: category.repoTitle,
    kind: 'docs',
    source: category
  };
}

export function buildKnowledgeSpaces(meta) {
  const docSpaces = (meta?.categories || [])
    .map((category) => buildDocKnowledgeSpace(category))
    .filter(Boolean);

  return [...docSpaces, getAiTutorialSpace()];
}

export function findActiveKnowledgeSpace(meta, path) {
  if (
    path.startsWith(AI_TUTORIALS_PATH) ||
    path.startsWith(LEARN_AI_BASE_PATH) ||
    path.startsWith('/learn-claude-code/')
  ) {
    return getAiTutorialSpace();
  }

  const activeCategory = findActiveCategoryByPath(meta, path);

  return buildDocKnowledgeSpace(activeCategory);
}
