import { fetchJson } from './http';
import { normalizeDocsMeta } from './docsMetaNormalizer';

export {
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
  getFirstNavigableFileForCategory,
  getFirstNavigableItemForCategory,
  getFirstNavigableItemForSection,
  getFirstNavigablePathForCategory,
  getFirstNavigablePathForSection,
  groupArticlesByCategory,
  groupArticlesByDate,
  normalizeMetaPath
} from './docsMetaSelectors';

const PUBLIC_URL = process.env.PUBLIC_URL || '';
const DOCS_META_PATH = `${PUBLIC_URL}/docs/_meta.json`;

const docsMetaCache = new Map();
const docsMetaPromises = new Map();

function resolveMetaUrl(metaPath) {
  if (!metaPath) {
    return '';
  }

  if (/^https?:\/\//.test(metaPath)) {
    return metaPath;
  }

  const normalizedPath = metaPath.startsWith('/') ? metaPath : `/${metaPath}`;
  return `${PUBLIC_URL}${normalizedPath}`;
}

function mergeBookMeta(entry, categoryMeta) {
  return {
    ...categoryMeta,
    id: categoryMeta?.id || entry.id,
    title: categoryMeta?.title || entry.title,
    description: categoryMeta?.description || entry.description || '',
    githubRepo: categoryMeta?.githubRepo || entry.githubRepo,
    repoTitle: categoryMeta?.repoTitle || entry.repoTitle
  };
}

async function resolveDocsMeta(data) {
  if (Array.isArray(data?.categories)) {
    return data;
  }

  const rootMeta = normalizeDocsMeta(data);

  if (!Array.isArray(rootMeta?.books) || rootMeta.books.length === 0) {
    return data;
  }

  const resolvableBooks = rootMeta.books.filter((entry) => entry.metaFile);
  const categories = await Promise.all(
    resolvableBooks.map(async (entry) => {
      const categoryMeta = await fetchJson(resolveMetaUrl(entry.metaFile));
      return mergeBookMeta(entry, categoryMeta);
    })
  );

  return {
    ...rootMeta,
    categories
  };
}

export function getDocsMetaUrl() {
  return DOCS_META_PATH;
}

export function getCachedDocsMeta(metaUrl = getDocsMetaUrl()) {
  if (!metaUrl) {
    return null;
  }

  return docsMetaCache.get(metaUrl) || null;
}

export function clearDocsMetaCache() {
  docsMetaCache.clear();
  docsMetaPromises.clear();
}

export async function loadDocsMeta(metaUrl = getDocsMetaUrl()) {
  if (!metaUrl) {
    throw new Error('Meta URL is required');
  }

  if (docsMetaCache.has(metaUrl)) {
    return docsMetaCache.get(metaUrl);
  }

  if (docsMetaPromises.has(metaUrl)) {
    return docsMetaPromises.get(metaUrl);
  }

  const request = fetchJson(metaUrl)
    .then(resolveDocsMeta)
    .then((data) => {
      const normalized = normalizeDocsMeta(data);
      docsMetaCache.set(metaUrl, normalized);
      return normalized;
    })
    .finally(() => {
      docsMetaPromises.delete(metaUrl);
    });

  docsMetaPromises.set(metaUrl, request);

  return request;
}
