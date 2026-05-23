import { AI_INSIGHTS_CATEGORY_ID } from './siteRoutes';

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function shouldWarn(options) {
  return options.warn !== false && process.env.NODE_ENV !== 'production';
}

function warnMetaIssue(message, context, options) {
  if (!shouldWarn(options)) {
    return;
  }

  // Keep malformed content visible during local authoring without breaking pages.
  console.warn(`[docs-meta] ${message}`, context);
}

function toStringValue(value, fallback = '') {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (value === null || typeof value === 'undefined') {
    return fallback;
  }

  return String(value).trim() || fallback;
}

function toArray(value, context, options) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== 'undefined') {
    warnMetaIssue('Expected an array; using an empty array instead.', context, options);
  }

  return [];
}

export function normalizeMetaRoutePath(path = '') {
  const value = toStringValue(path);
  if (!value) {
    return '';
  }

  if (/^(https?:|mailto:|tel:|#)/.test(value)) {
    return value;
  }

  return value.startsWith('/') ? value : `/${value}`;
}

export function normalizeMetaFilePath(file = '') {
  const value = toStringValue(file);
  if (!value) {
    return '';
  }

  if (/^(https?:|\.\/|\.\.\/)/.test(value)) {
    return value;
  }

  return value.startsWith('/') ? value : `/${value}`;
}

function normalizeTags(tags, context, options) {
  return [...new Set(
    toArray(tags, context, options)
      .map((tag) => toStringValue(tag))
      .filter(Boolean)
  )];
}

function normalizeContributors(contributors, context, options) {
  return toArray(contributors, context, options)
    .map((contributor) => {
      if (!isPlainObject(contributor)) {
        warnMetaIssue('Ignoring malformed contributor.', context, options);
        return null;
      }

      return {
        ...contributor,
        role: toStringValue(contributor.role),
        name: toStringValue(contributor.name),
        link: toStringValue(contributor.link)
      };
    })
    .filter((contributor) => contributor?.name);
}

function normalizePublishedAt(value, context, options) {
  const publishedAt = toStringValue(value);
  if (!publishedAt) {
    return '';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
    warnMetaIssue('Expected publishedAt to use YYYY-MM-DD format.', context, options);
  }

  return publishedAt;
}

function normalizeMetaItem(item, context, options) {
  if (!isPlainObject(item)) {
    warnMetaIssue('Ignoring malformed item.', context, options);
    return null;
  }

  const itemContext = `${context}.item:${toStringValue(item.title, 'untitled')}`;
  const children = toArray(item.children, `${itemContext}.children`, options)
    .map((child) => normalizeMetaItem(child, `${itemContext}.children`, options))
    .filter(Boolean);

  const nestedItems = toArray(item.items, `${itemContext}.items`, options)
    .map((child) => normalizeMetaItem(child, `${itemContext}.items`, options))
    .filter(Boolean);

  return {
    ...item,
    title: toStringValue(item.title, 'Untitled'),
    path: normalizeMetaRoutePath(item.path),
    file: normalizeMetaFilePath(item.file),
    publishedAt: normalizePublishedAt(item.publishedAt, itemContext, options),
    tags: normalizeTags(item.tags, `${itemContext}.tags`, options),
    contributors: normalizeContributors(item.contributors, `${itemContext}.contributors`, options),
    children,
    items: nestedItems
  };
}

function normalizeSection(section, context, options) {
  if (!isPlainObject(section)) {
    warnMetaIssue('Ignoring malformed section.', context, options);
    return null;
  }

  const sectionContext = `${context}.section:${toStringValue(section.title, 'untitled')}`;

  return {
    ...section,
    title: toStringValue(section.title, 'Untitled'),
    path: normalizeMetaRoutePath(section.path),
    file: normalizeMetaFilePath(section.file),
    tags: normalizeTags(section.tags, `${sectionContext}.tags`, options),
    contributors: normalizeContributors(section.contributors, `${sectionContext}.contributors`, options),
    items: toArray(section.items, `${sectionContext}.items`, options)
      .map((item) => normalizeMetaItem(item, sectionContext, options))
      .filter(Boolean)
  };
}

function normalizeCategory(category, index, options) {
  if (!isPlainObject(category)) {
    warnMetaIssue('Ignoring malformed category.', `categories[${index}]`, options);
    return null;
  }

  const fallbackId = `category-${index + 1}`;
  const id = toStringValue(category.id, fallbackId).replace(/^\/+|\/+$/g, '') || fallbackId;
  const context = `category:${id}`;
  const sections = toArray(category.sections, `${context}.sections`, options)
    .map((section) => normalizeSection(section, context, options))
    .filter(Boolean);

  return {
    ...category,
    id,
    title: toStringValue(category.title, id),
    description: toStringValue(category.description),
    entryPath: normalizeMetaRoutePath(category.entryPath),
    githubRepo: toStringValue(category.githubRepo),
    repoTitle: toStringValue(category.repoTitle),
    sections: id === AI_INSIGHTS_CATEGORY_ID ? [...sections].reverse() : sections
  };
}

function normalizeBookEntry(book, index, options) {
  if (!isPlainObject(book)) {
    warnMetaIssue('Ignoring malformed book entry.', `books[${index}]`, options);
    return null;
  }

  const fallbackId = `book-${index + 1}`;
  const id = toStringValue(book.id, fallbackId).replace(/^\/+|\/+$/g, '') || fallbackId;
  const metaFile = normalizeMetaFilePath(book.metaFile);

  if (!metaFile) {
    warnMetaIssue('Book entry is missing metaFile and will be skipped when resolving categories.', `books[${index}]`, options);
  }

  return {
    ...book,
    id,
    title: toStringValue(book.title, id),
    description: toStringValue(book.description),
    metaFile,
    githubRepo: toStringValue(book.githubRepo),
    repoTitle: toStringValue(book.repoTitle)
  };
}

export function normalizeDocsMeta(rawMeta, options = {}) {
  if (!isPlainObject(rawMeta)) {
    warnMetaIssue('Expected meta root object; using an empty meta object.', 'root', options);
    return { title: '', description: '', books: [], categories: [] };
  }

  const books = toArray(rawMeta.books, 'root.books', options)
    .map((book, index) => normalizeBookEntry(book, index, options))
    .filter(Boolean);

  if (Array.isArray(rawMeta.categories)) {
    return {
      ...rawMeta,
      title: toStringValue(rawMeta.title),
      description: toStringValue(rawMeta.description),
      books,
      categories: rawMeta.categories
        .map((category, index) => normalizeCategory(category, index, options))
        .filter(Boolean)
    };
  }

  if (Array.isArray(rawMeta.books) && !Array.isArray(rawMeta.sections)) {
    return {
      ...rawMeta,
      title: toStringValue(rawMeta.title),
      description: toStringValue(rawMeta.description),
      books,
      categories: []
    };
  }

  return {
    ...normalizeCategory(rawMeta, 0, options),
    books
  };
}
