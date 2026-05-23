import {
  buildArticleTagList,
  buildSearchableDocs,
  buildTagIndex,
  collectDocPaths,
  filterArticlesByTag,
  findActiveCategoryByPath,
  findArticleTags,
  findCategoryById,
  findMetaEntryByPath,
  getAllTags,
  getArticlesByTag,
  getCategoryArticles,
  getDefaultDocsPath,
  getFirstNavigablePathForCategory,
  groupArticlesByCategory,
  groupArticlesByDate,
  normalizeMetaPath
} from '../../utils/docsMetaSelectors';
import {
  buildKnowledgeSpaces,
  findActiveKnowledgeSpace,
  getAiTutorialSpace
} from '../../utils/knowledgeSpaces';
import { normalizeDocComponentMarkdown, resolvePublicContentUrl } from '../../utils/markdown';
import { flattenChapters, getAdjacentChapters } from '../../utils/navigationHelpers';
import { AI_INSIGHTS_CATEGORY_ID } from '../../utils/siteRoutes';

const EMPTY_ADJACENT_CHAPTERS = Object.freeze({ prev: null, next: null });
const EMPTY_TAGS = Object.freeze([]);
const EMPTY_ARCHIVE_MODEL = Object.freeze({
  articles: [],
  tagList: [],
  filteredArticles: [],
  groups: [],
  filteredCount: 0
});

function stripLeadingSlash(pathname = '') {
  return String(pathname || '').replace(/^\//, '');
}

function buildFallbackMarkdownFile(docPath) {
  return docPath ? `/docs/${docPath}.md` : '';
}

export function normalizeDocPath(path = '') {
  return normalizeMetaPath(path);
}

export function findDocCategory(meta, categoryId) {
  return findCategoryById(meta, categoryId);
}

export function findDocTitleByPath(meta, path) {
  return findMetaEntryByPath(meta, path)?.item?.title || null;
}

export function getCategoryEntryPath(category, fallbackPath = '#') {
  return category?.entryPath || getFirstNavigablePathForCategory(category) || fallbackPath;
}

export function buildKnowledgeNavigationModel(meta) {
  return {
    categories: meta?.categories || [],
    spaces: buildKnowledgeSpaces(meta)
  };
}

export function getAiTutorialNavigationSpace() {
  return getAiTutorialSpace();
}

export function buildArticlePrefetchModel(item) {
  return {
    file: item?.file || '',
    path: item?.path || ''
  };
}

export function buildSearchableDocsModel(meta) {
  return buildSearchableDocs(meta);
}

export function buildTagModel(meta) {
  const tagIndex = buildTagIndex(meta);

  return {
    tagIndex,
    getAllTags: () => getAllTags(tagIndex),
    getArticlesByTag: (tagName) => getArticlesByTag(tagIndex, tagName),
    groupByCategory: groupArticlesByCategory,
    findArticleTags: (path) => findArticleTags(meta, path)
  };
}

export function buildDocArticleRouteModel({
  meta,
  pathname = '',
  findTitleByPath = () => null
} = {}) {
  const docPath = stripLeadingSlash(pathname);
  const docMetaEntry = findMetaEntryByPath(meta, pathname);
  const file = docMetaEntry?.item?.file || buildFallbackMarkdownFile(docPath);

  return {
    docPath,
    docMetaEntry,
    category: docMetaEntry?.category || null,
    section: docMetaEntry?.section || null,
    item: docMetaEntry?.item || null,
    isArticleEntry: docMetaEntry?.type === 'item',
    isAiInsightsArticle: docMetaEntry?.category?.id === AI_INSIGHTS_CATEGORY_ID,
    markdownUrl: resolvePublicContentUrl(file),
    titleFromMeta: docMetaEntry?.item?.title || findTitleByPath(pathname)
  };
}

export function buildNormalizedArticleMarkdown(content, { isAiInsightsArticle = false, stripTitle } = {}) {
  const articleContent = typeof stripTitle === 'function'
    ? stripTitle(content, isAiInsightsArticle)
    : content;

  return normalizeDocComponentMarkdown(articleContent);
}

export function buildDocArticleHistoryRecord({
  articleRoute,
  pathname = '',
  frontmatter = {},
  rawDoc = '',
  error = null
} = {}) {
  if (error || !rawDoc || !articleRoute?.isArticleEntry) {
    return null;
  }

  const articleTitle = articleRoute.titleFromMeta || frontmatter.title;
  if (!articleTitle) {
    return null;
  }

  return {
    path: pathname,
    title: articleTitle,
    categoryId: articleRoute.category?.id || null,
    category: articleRoute.category?.title || null,
    section: articleRoute.section?.title || null
  };
}

export function buildDocArticleNavigationModel({
  meta,
  pathname = '',
  docMetaEntry = null,
  findArticleTags = () => []
} = {}) {
  if (!meta) {
    return {
      adjacentChapters: EMPTY_ADJACENT_CHAPTERS,
      articleTags: EMPTY_TAGS
    };
  }

  const chapters = flattenChapters(meta);

  return {
    adjacentChapters: getAdjacentChapters(chapters, pathname),
    articleTags: docMetaEntry?.item?.tags || findArticleTags(pathname)
  };
}

export function buildSidebarMeta(category) {
  if (!category) {
    return null;
  }

  return {
    title: category.title,
    sections: category.sections,
    githubRepo: category.githubRepo,
    repoTitle: category.repoTitle,
    bookPath: category.bookPath || null
  };
}

export function buildDocsWorkspaceModel({ meta, shellMeta = null, pathname = '' } = {}) {
  const navMeta = shellMeta || meta;
  const sidebarCategory = findActiveCategoryByPath(meta, pathname);

  return {
    navMeta,
    categories: navMeta?.categories || [],
    spaces: buildKnowledgeSpaces(navMeta),
    activeCategory: findActiveCategoryByPath(navMeta, pathname),
    activeSpace: findActiveKnowledgeSpace(navMeta, pathname),
    sidebarCategory,
    sidebarMeta: buildSidebarMeta(sidebarCategory)
  };
}

export function buildDocsRouteValidationModel(meta, pathname = '') {
  const validPaths = collectDocPaths(meta);
  const defaultPath = getDefaultDocsPath(meta);

  return {
    defaultPath,
    validPaths,
    isValidDocsPath: pathname === '/' || validPaths.has(pathname)
  };
}

export function buildLearnAiDocsMeta({ spaceMeta, currentSpace, parentTitle = '' } = {}) {
  if (!spaceMeta || !currentSpace) {
    return null;
  }

  return {
    categories: [{
      ...spaceMeta,
      id: currentSpace.docsCategoryId || currentSpace.slug,
      title: currentSpace.bookTitle || spaceMeta.title,
      githubRepo: currentSpace.githubRepo || spaceMeta.githubRepo,
      repoTitle: currentSpace.repoTitle || spaceMeta.repoTitle,
      bookPath: {
        parentTitle,
        currentTitle: currentSpace.bookTitle || spaceMeta.title
      }
    }]
  };
}

export function buildLearnAiDocsRouteValidationModel(meta, pathname = '', basePath = '') {
  const validPaths = collectDocPaths(meta);
  const normalizedPathname = normalizeDocPath(pathname);
  const normalizedBasePath = normalizeDocPath(basePath);
  const isBasePath = normalizedPathname === normalizedBasePath;

  return {
    isBasePath,
    isValidPath: isBasePath || validPaths.has(normalizedPathname),
    normalizedPathname,
    validPaths
  };
}

export function buildDocsArchiveModel(category, selectedTag = '') {
  if (!category) {
    return EMPTY_ARCHIVE_MODEL;
  }

  const articles = getCategoryArticles(category);
  const tagList = buildArticleTagList(articles);
  const filteredArticles = filterArticlesByTag(articles, selectedTag);
  const groups = groupArticlesByDate(filteredArticles);

  return {
    articles,
    tagList,
    filteredArticles,
    groups,
    filteredCount: filteredArticles.length
  };
}
