import React, { createContext, useContext, useMemo } from 'react';
import { normalizeMetaPath } from '../utils/docsMeta';

const TagContext = createContext();

export const useTag = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('useTag must be used within a TagProvider');
  }
  return context;
};

/**
 * Recursively build a tag index from meta.json structure
 * @param {Object} meta - The meta.json data
 * @returns {Object} - Tag index mapping tag names to article arrays
 */
const buildTagIndex = (meta) => {
  const tagIndex = {};

  const processItem = (item, categoryTitle) => {
    if (item.tags && Array.isArray(item.tags) && item.tags.length > 0) {
      const articleInfo = {
        title: item.title,
        path: item.path,
        category: categoryTitle,
        file: item.file
      };

      item.tags.forEach(tag => {
        if (!tagIndex[tag]) {
          tagIndex[tag] = [];
        }
        tagIndex[tag].push(articleInfo);
      });
    }

    // Process children recursively (for nested structures)
    if (item.children && Array.isArray(item.children)) {
      item.children.forEach(child => processItem(child, categoryTitle));
    }

    // Process items recursively
    if (item.items && Array.isArray(item.items)) {
      item.items.forEach(child => processItem(child, categoryTitle));
    }
  };

  // Process all categories
  if (meta && meta.categories) {
    meta.categories.forEach(category => {
      const categoryTitle = category.title;

      // Process sections
      if (category.sections) {
        category.sections.forEach(section => {
          // Process section itself (only if it has tags, the recursion will handle items)
          processItem(section, categoryTitle);
        });
      }
    });
  }

  return tagIndex;
};

/**
 * Get all unique tags from the meta data
 * @param {Object} tagIndex - The tag index
 * @returns {Array} - Sorted array of tag names
 */
const getAllTags = (tagIndex) => {
  return Object.keys(tagIndex).sort();
};

/**
 * Get articles by tag name
 * @param {Object} tagIndex - The tag index
 * @param {string} tagName - The tag to search for
 * @returns {Array} - Array of articles with the specified tag
 */
const getArticlesByTag = (tagIndex, tagName) => {
  return tagIndex[tagName] || [];
};

/**
 * Group articles by category
 * @param {Array} articles - Array of article objects
 * @returns {Object} - Object with categories as keys and article arrays as values
 */
const groupByCategory = (articles) => {
  const grouped = {};

  articles.forEach(article => {
    const category = article.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(article);
  });

  return grouped;
};

/**
 * Find tags for a specific article by path
 * @param {Object} meta - The meta.json data
 * @param {string} path - The article path
 * @returns {Array} - Array of tags for the article
 */
const findArticleTags = (meta, path) => {
  let foundTags = null;
  const normalizedPath = normalizeMetaPath(path);

  const searchItem = (item) => {
    if (normalizeMetaPath(item.path) === normalizedPath) {
      foundTags = item.tags || [];
      return true;
    }

    if (item.items && Array.isArray(item.items)) {
      for (const child of item.items) {
        if (searchItem(child)) {
          return true;
        }
      }
    }

    return false;
  };

  if (meta && meta.categories) {
    for (const category of meta.categories) {
      if (category.sections) {
        for (const section of category.sections) {
          if (searchItem(section)) {
            return foundTags;
          }

          if (section.items) {
            for (const item of section.items) {
              if (searchItem(item)) {
                return foundTags;
              }
            }
          }
        }
      }
    }
  }

  return [];
};

export const TagProvider = ({ children, meta }) => {
  // Build tag index and cache it
  const tagIndex = useMemo(() => buildTagIndex(meta), [meta]);

  const value = {
    tagIndex,
    getAllTags: () => getAllTags(tagIndex),
    getArticlesByTag: (tagName) => getArticlesByTag(tagIndex, tagName),
    groupByCategory,
    findArticleTags: (path) => findArticleTags(meta, path)
  };

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
};
