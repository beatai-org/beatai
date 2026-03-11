import React, { createContext, useContext, useState, useMemo } from 'react';

const PageTitleContext = createContext(null);

export function usePageTitle() {
  const context = useContext(PageTitleContext);
  if (!context) {
    return { pageTitle: null, setPageTitle: () => {}, findTitleByPath: () => null };
  }
  return context;
}

/**
 * Find title from meta data by path
 * @param {Object} meta - _meta.json data
 * @param {string} path - Page path
 * @returns {string|null} - Page title or null
 */
function findTitleInMeta(meta, path) {
  if (!meta || !meta.categories) {
    return null;
  }

  // Recursively search in items
  function searchItems(items) {
    for (const item of items) {
      if (item.path === path) {
        return item.title;
      }
      // Search in children
      if (item.children && item.children.length > 0) {
        const found = searchItems(item.children);
        if (found) return found;
      }
    }
    return null;
  }

  // Search through all categories and sections
  for (const category of meta.categories) {
    for (const section of category.sections) {
      const found = searchItems(section.items);
      if (found) return found;
    }
  }

  return null;
}

export function PageTitleProvider({ meta, children }) {
  const [pageTitle, setPageTitle] = useState(null);

  // Memoize the findTitleByPath function
  const findTitleByPath = useMemo(() => {
    return (path) => findTitleInMeta(meta, path);
  }, [meta]);

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle, findTitleByPath }}>
      {children}
    </PageTitleContext.Provider>
  );
}
