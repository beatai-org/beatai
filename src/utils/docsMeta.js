import { fetchJson } from './http';
import { AI_INSIGHTS_CATEGORY_ID } from './siteRoutes';

const PUBLIC_URL = process.env.PUBLIC_URL || '';
const DOCS_META_PATH = `${PUBLIC_URL}/docs/_meta.json`;

const docsMetaCache = new Map();
const docsMetaPromises = new Map();

function normalizeCategoryMeta(category) {
  if (category?.id !== AI_INSIGHTS_CATEGORY_ID || !Array.isArray(category.sections)) {
    return category;
  }

  return {
    ...category,
    sections: [...category.sections].reverse()
  };
}

function normalizeDocsMeta(meta) {
  if (!meta?.categories) {
    return meta;
  }

  return {
    ...meta,
    categories: meta.categories.map(normalizeCategoryMeta)
  };
}

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

export function normalizeMetaPath(path = '') {
  if (!path) {
    return '';
  }

  try {
    return decodeURI(path);
  } catch (error) {
    return path;
  }
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

  if (!Array.isArray(data?.books)) {
    return data;
  }

  const categories = await Promise.all(
    data.books.map(async (entry) => {
      const categoryMeta = await fetchJson(resolveMetaUrl(entry.metaFile));
      return mergeBookMeta(entry, categoryMeta);
    })
  );

  return {
    ...data,
    categories
  };
}

function findFirstPathInItems(items = []) {
  for (const item of items) {
    if (item.path) {
      return item.path;
    }

    if (item.children?.length) {
      const childPath = findFirstPathInItems(item.children);
      if (childPath) {
        return childPath;
      }
    }
  }

  return null;
}

function findItemByPath(items = [], path, category, section) {
  const normalizedPath = normalizeMetaPath(path);

  for (const item of items) {
    if (normalizeMetaPath(item.path) === normalizedPath) {
      return { type: 'item', item, category, section };
    }

    if (item.children?.length) {
      const found = findItemByPath(item.children, path, category, section);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

export function getDocsMetaUrl() {
  return DOCS_META_PATH;
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

export function getFirstNavigablePathForSection(section) {
  if (!section) {
    return null;
  }

  return findFirstPathInItems(section.items || []) || section.path || null;
}

export function getFirstNavigablePathForCategory(category) {
  if (!category) {
    return null;
  }

  return getFirstNavigablePathForSection(category.sections?.[0]);
}

export function getDefaultDocsPath(meta) {
  return getFirstNavigablePathForCategory(meta?.categories?.[0]) || '/';
}

export function collectDocPaths(meta) {
  const paths = new Set();

  const addPath = (path) => {
    if (!path) {
      return;
    }

    const normalizedPath = normalizeMetaPath(path);
    paths.add(normalizedPath);

    try {
      paths.add(encodeURI(normalizedPath));
    } catch (error) {
      // Keep the normalized path only when encoding fails.
    }
  };

  const collectItems = (items = []) => {
    items.forEach((item) => {
      if (item.path) {
        addPath(item.path);
      }

      if (item.children?.length) {
        collectItems(item.children);
      }
    });
  };

  (meta?.categories || []).forEach((category) => {
    addPath(`/${category.id}`);

    (category.sections || []).forEach((section) => {
      if (section.path) {
        addPath(section.path);
      }

      collectItems(section.items || []);
    });
  });

  return paths;
}

export function findMetaEntryByPath(meta, path) {
  const normalizedPath = normalizeMetaPath(path);

  for (const category of meta?.categories || []) {
    if (normalizeMetaPath(`/${category.id}`) === normalizedPath) {
      return { type: 'category', item: category, category, section: null };
    }

    for (const section of category.sections || []) {
      if (normalizeMetaPath(section.path) === normalizedPath) {
        return { type: 'section', item: section, category, section };
      }

      const foundItem = findItemByPath(section.items || [], normalizedPath, category, section);
      if (foundItem) {
        return foundItem;
      }
    }
  }

  return null;
}

export function findActiveCategoryByPath(meta, path) {
  const found = findMetaEntryByPath(meta, path);
  const normalizedPath = normalizeMetaPath(path);

  if (found?.category) {
    return found.category;
  }

  const categories = meta?.categories || [];
  const categoryByPrefix = categories.find((category) => normalizedPath.startsWith(`/${category.id}`));

  return categoryByPrefix || categories[0] || null;
}
