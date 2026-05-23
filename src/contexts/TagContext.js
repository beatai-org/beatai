import React, { createContext, useContext, useMemo } from 'react';
import {
  buildTagIndex,
  findArticleTags,
  getAllTags,
  getArticlesByTag,
  groupArticlesByCategory
} from '../utils/docsMetaSelectors';

const TagContext = createContext();

export const useTag = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('useTag must be used within a TagProvider');
  }
  return context;
};

export const TagProvider = ({ children, meta }) => {
  // Build tag index and cache it
  const tagIndex = useMemo(() => buildTagIndex(meta), [meta]);

  const value = {
    tagIndex,
    getAllTags: () => getAllTags(tagIndex),
    getArticlesByTag: (tagName) => getArticlesByTag(tagIndex, tagName),
    groupByCategory: groupArticlesByCategory,
    findArticleTags: (path) => findArticleTags(meta, path)
  };

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
};
