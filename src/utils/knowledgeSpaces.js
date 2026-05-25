import {
  findActiveCategoryByPath,
  findMetaEntryByPath,
  getFirstNavigableFileForCategory,
  getFirstNavigablePathForCategory
} from './docsMetaSelectors';
import {
  COLLECTIONS,
  getBookByPathname,
  getCollectionByPathname,
  getCollectionOfBook
} from '../content';

// Resolve the active "knowledge space" — the conceptual top-level grouping
// the user is currently inside. Used by DocsLayout for sidebar/breadcrumb
// context; the top nav has its own derivation (getActiveTopNavItem).
function spaceFromCollection(collection) {
  if (!collection) {
    return null;
  }
  return {
    id: collection.id,
    title: collection.title,
    entryPath: collection.basePath,
    kind: 'tutorial-hub'
  };
}

function getDocKnowledgeSpaceEntryFile(category, entryPath) {
  if (!entryPath) {
    return getFirstNavigableFileForCategory(category);
  }

  return findMetaEntryByPath({ categories: [category] }, entryPath)?.item?.file
    || getFirstNavigableFileForCategory(category);
}

function buildDocKnowledgeSpace(category) {
  if (!category) {
    return null;
  }

  const entryPath = category.entryPath || getFirstNavigablePathForCategory(category);

  return {
    id: category.id,
    title: category.title,
    entryPath,
    entryFile: getDocKnowledgeSpaceEntryFile(category, entryPath),
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

  const collectionSpaces = COLLECTIONS.map((collection) => spaceFromCollection(collection));

  return [...docSpaces, ...collectionSpaces];
}

export function findActiveKnowledgeSpace(meta, path) {
  // Legacy /learn-claude-code/* path still surfaces as the LCC book / its collection.
  if (path.startsWith('/learn-claude-code/')) {
    return spaceFromCollection(getCollectionOfBook('learn-claude-code'));
  }

  // Hub-index URL (e.g. /learn-ai exactly).
  const directCollection = getCollectionByPathname(path);
  if (directCollection) {
    return spaceFromCollection(directCollection);
  }

  // Inside a book URL — surface the collection if it has one.
  const book = getBookByPathname(path);
  if (book) {
    const collection = getCollectionOfBook(book.id);
    if (collection) {
      return spaceFromCollection(collection);
    }
  }

  const activeCategory = findActiveCategoryByPath(meta, path);
  return buildDocKnowledgeSpace(activeCategory);
}
