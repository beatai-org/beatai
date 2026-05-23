import { useMemo } from 'react';
import { flattenChapters, getAdjacentChapters } from '../../utils/navigationHelpers';

const EMPTY_ADJACENT_CHAPTERS = Object.freeze({ prev: null, next: null });
const EMPTY_TAGS = Object.freeze([]);

export function useDocArticleNavigation({
  meta,
  pathname = '',
  docMetaEntry = null,
  findArticleTags = () => []
} = {}) {
  return useMemo(() => {
    if (!meta) {
      return {
        adjacentChapters: EMPTY_ADJACENT_CHAPTERS,
        articleTags: EMPTY_TAGS
      };
    }

    const chapters = flattenChapters(meta);

    return {
      adjacentChapters: getAdjacentChapters(chapters, pathname),
      articleTags: docMetaEntry?.item?.tags || findArticleTags(pathname)
    };
  }, [docMetaEntry, findArticleTags, meta, pathname]);
}
