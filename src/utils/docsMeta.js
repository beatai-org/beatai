import { fetchJson } from './http';
import { BOOKS } from '../content';
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
// Sentinel key for the "root" meta (categories derived from src/content/books).
const ROOT_META_KEY = '__root__';

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

function mergeBookMeta(book, categoryMeta) {
  return {
    ...categoryMeta,
    id: categoryMeta?.id || book.id,
    title: categoryMeta?.title || book.title,
    description: categoryMeta?.description || book.description || '',
    githubRepo: categoryMeta?.githubRepo || book.githubRepo,
    repoTitle: categoryMeta?.repoTitle || book.repoTitle
  };
}

// Build the "root" meta — a single { categories } object covering every
// markdown book in the registry. Used by surfaces that need a global view of
// the doc tree (search/tag indexing, the NotFound shell, the docs sidebar
// when on a top-level book, etc.).
async function buildRootMeta() {
  const markdownBooks = BOOKS.filter((book) => book.contentKind === 'markdown' && book.metaFile);

  const categories = await Promise.all(
    markdownBooks.map(async (book) => {
      const categoryMeta = await fetchJson(resolveMetaUrl(book.metaFile));
      return mergeBookMeta(book, categoryMeta);
    })
  );

  return { categories };
}

export function getCachedDocsMeta(metaUrl) {
  const key = metaUrl || ROOT_META_KEY;
  return docsMetaCache.get(key) || null;
}

export function clearDocsMetaCache() {
  docsMetaCache.clear();
  docsMetaPromises.clear();
}

export async function loadDocsMeta(metaUrl) {
  const key = metaUrl || ROOT_META_KEY;

  if (docsMetaCache.has(key)) {
    return docsMetaCache.get(key);
  }

  if (docsMetaPromises.has(key)) {
    return docsMetaPromises.get(key);
  }

  const dataPromise = metaUrl
    ? fetchJson(metaUrl)
    : buildRootMeta();

  const request = dataPromise
    .then((data) => {
      const normalized = normalizeDocsMeta(data);
      docsMetaCache.set(key, normalized);
      return normalized;
    })
    .finally(() => {
      docsMetaPromises.delete(key);
    });

  docsMetaPromises.set(key, request);

  return request;
}
