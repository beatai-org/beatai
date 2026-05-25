// Query helpers over BOOKS / COLLECTIONS / TOP_NAV. All routing, prefetch,
// header, and breadcrumb logic should ask these functions rather than
// inspecting the raw arrays.

import { BOOKS } from './books';
import { COLLECTIONS } from './collections';
import { TOP_NAV } from './topNav';

export { BOOKS, COLLECTIONS, TOP_NAV };

export function getBookById(id) {
  return BOOKS.find((book) => book.id === id) || null;
}

export function getCollectionById(id) {
  return COLLECTIONS.find((collection) => collection.id === id) || null;
}

export function getCollectionOfBook(bookOrId) {
  const id = typeof bookOrId === 'string' ? bookOrId : bookOrId?.id;
  if (!id) {
    return null;
  }
  return COLLECTIONS.find((collection) => collection.bookIds.includes(id)) || null;
}

export function getBooksOfCollection(collectionOrId) {
  const id = typeof collectionOrId === 'string' ? collectionOrId : collectionOrId?.id;
  const collection = id ? getCollectionById(id) : null;
  if (!collection) {
    return [];
  }
  return collection.bookIds
    .map((bookId) => getBookById(bookId))
    .filter(Boolean);
}

// URL base path for a book:
//   no collection → /<slug>
//   in a collection → /<collection.basePath>/<slug>
export function getBookBasePath(bookOrId) {
  const book = typeof bookOrId === 'string' ? getBookById(bookOrId) : bookOrId;
  if (!book) {
    return '';
  }
  const collection = getCollectionOfBook(book.id);
  return collection
    ? `${collection.basePath}/${book.slug}`
    : `/${book.slug}`;
}

// Default URL for a book (used by "open this book" links).
export function getBookDefaultUrl(bookOrId) {
  const book = typeof bookOrId === 'string' ? getBookById(bookOrId) : bookOrId;
  if (!book) {
    return '/';
  }
  const base = getBookBasePath(book);
  return book.defaultEntry ? `${base}/${book.defaultEntry}` : base;
}

// Find the book whose URL prefix matches the given pathname.
// Longest-prefix match so /learn-ai/agent-harness/x doesn't hit /learn-ai/agent.
export function getBookByPathname(pathname = '') {
  if (!pathname) {
    return null;
  }
  return BOOKS
    .map((book) => ({ book, base: getBookBasePath(book) }))
    .filter(({ base }) => pathname === base || pathname.startsWith(`${base}/`))
    .sort((a, b) => b.base.length - a.base.length)
    .map(({ book }) => book)[0] || null;
}

// Find the collection whose basePath matches the given pathname (when on the
// hub page itself, e.g. /learn-ai exactly).
export function getCollectionByPathname(pathname = '') {
  if (!pathname) {
    return null;
  }
  return COLLECTIONS.find((collection) => collection.basePath === pathname) || null;
}

// Project TOP_NAV into renderable items: { id, label, href }.
// Returns null entries (and the consumer should filter) only if the reference
// points at an unknown book/collection id.
export function getTopNavItems() {
  return TOP_NAV
    .map((entry) => {
      if (entry.kind === 'book') {
        const book = getBookById(entry.id);
        if (!book) return null;
        return { id: book.id, label: book.title, href: getBookDefaultUrl(book) };
      }
      if (entry.kind === 'collection') {
        const collection = getCollectionById(entry.id);
        if (!collection) return null;
        return { id: collection.id, label: collection.title, href: collection.basePath };
      }
      // 'route' | 'external'
      return { id: `route:${entry.href}`, label: entry.label, href: entry.href };
    })
    .filter(Boolean);
}

export function getActiveTopNavItem(pathname = '') {
  const items = getTopNavItems();
  return items
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0] || null;
}
