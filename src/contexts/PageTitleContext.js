import React, { createContext, useContext, useState, useMemo } from 'react';
import { findMetaEntryByPath } from '../utils/docsMetaSelectors';

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
  return findMetaEntryByPath(meta, path)?.item?.title || null;
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
