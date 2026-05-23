import { forEachDocItem } from './docsMetaTraversal';

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

function findFirstPathInItems(items = []) {
  for (const item of items) {
    if (item.path) {
      return item.path;
    }

    const childPath = findFirstPathInItems(item.children || []);
    if (childPath) {
      return childPath;
    }

    const nestedItemPath = findFirstPathInItems(item.items || []);
    if (nestedItemPath) {
      return nestedItemPath;
    }
  }

  return null;
}

function addPathVariant(paths, path) {
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
}

export function findCategoryById(meta, categoryId) {
  return (meta?.categories || []).find((category) => category.id === categoryId) || null;
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

  (meta?.categories || []).forEach((category) => {
    addPathVariant(paths, `/${category.id}`);
  });

  forEachDocItem(meta, (item) => {
    addPathVariant(paths, item.path);
  }, { includeSections: true });

  return paths;
}

export function findMetaEntryByPath(meta, path) {
  const normalizedPath = normalizeMetaPath(path);

  for (const category of meta?.categories || []) {
    if (normalizeMetaPath(`/${category.id}`) === normalizedPath) {
      return { type: 'category', item: category, category, section: null };
    }
  }

  let found = null;
  forEachDocItem(meta, (item, { category, section }) => {
    if (normalizeMetaPath(item.path) !== normalizedPath) {
      return undefined;
    }

    found = {
      type: item === section ? 'section' : 'item',
      item,
      category,
      section
    };
    return false;
  }, { includeSections: true });

  return found;
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

export function buildTagIndex(meta) {
  const tagIndex = {};

  forEachDocItem(meta, (item, { category }) => {
    if (item.tags.length === 0) {
      return;
    }

    const articleInfo = {
      title: item.title,
      path: item.path,
      category: category.title,
      file: item.file
    };

    item.tags.forEach((tag) => {
      if (!tagIndex[tag]) {
        tagIndex[tag] = [];
      }
      tagIndex[tag].push(articleInfo);
    });
  }, { includeSections: true });

  return tagIndex;
}

export function getAllTags(tagIndex) {
  return Object.keys(tagIndex).sort();
}

export function getArticlesByTag(tagIndex, tagName) {
  return tagIndex[tagName] || [];
}

export function groupArticlesByCategory(articles) {
  const grouped = {};

  articles.forEach((article) => {
    const category = article.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(article);
  });

  return grouped;
}

export function findArticleTags(meta, path) {
  const normalizedPath = normalizeMetaPath(path);
  let foundTags = null;

  forEachDocItem(meta, (item) => {
    if (normalizeMetaPath(item.path) === normalizedPath) {
      foundTags = item.tags;
      return false;
    }
    return undefined;
  }, { includeSections: true });

  return foundTags || [];
}

export function buildSearchableDocs(meta) {
  const searchableContent = [];

  forEachDocItem(meta, (item, { category, section }) => {
    searchableContent.push({
      title: item.title,
      path: item.path,
      section: section.title,
      category: category.title,
      description: item.description || ''
    });
  });

  return searchableContent;
}

export function getCategoryArticles(category) {
  const articles = [];

  forEachDocItem({ categories: category ? [category] : [] }, (item) => {
    if (item.path && item.publishedAt) {
      articles.push(item);
    }
  });

  return articles;
}

export function groupArticlesByDate(articles) {
  const map = new Map();

  articles.forEach((article) => {
    const date = article.publishedAt;
    if (!map.has(date)) {
      map.set(date, []);
    }
    map.get(date).push(article);
  });

  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0))
    .map(([date, items]) => ({ date, articles: items }));
}

export function buildArticleTagList(articles) {
  const counts = new Map();

  articles.forEach((article) => {
    article.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.tag.localeCompare(b.tag, 'zh');
    });
}

export function filterArticlesByTag(articles, tag) {
  if (!tag) {
    return articles;
  }

  return articles.filter((article) => article.tags.includes(tag));
}
