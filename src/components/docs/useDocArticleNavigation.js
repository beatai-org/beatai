import { useMemo } from 'react';
import { buildDocArticleNavigationModel } from '../../domain/docs';

export function useDocArticleNavigation({
  meta,
  pathname = '',
  docMetaEntry = null,
  findArticleTags = () => []
} = {}) {
  return useMemo(() => {
    return buildDocArticleNavigationModel({
      meta,
      pathname,
      docMetaEntry,
      findArticleTags
    });
  }, [docMetaEntry, findArticleTags, meta, pathname]);
}
