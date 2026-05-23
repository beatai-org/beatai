import { useMemo } from 'react';
import { useMarkdownSource } from '../../hooks/useMarkdownSource';
import { parseMarkdownFrontmatter } from '../../utils/markdownFrontmatter';
import {
  buildDocArticleHistoryRecord,
  buildDocArticleRouteModel,
  buildNormalizedArticleMarkdown
} from '../../domain/docs';
import {
  buildDocPageDescription,
  buildDocPageTitle,
  formatContributors,
  formatPublishedDate,
  stripAiInsightsTitle
} from './docContentUtils';

export function useDocArticleModel({ meta, pathname = '', findTitleByPath = () => null } = {}) {
  const articleRoute = useMemo(
    () => buildDocArticleRouteModel({ meta, pathname, findTitleByPath }),
    [findTitleByPath, meta, pathname]
  );
  const {
    docPath,
    docMetaEntry,
    isAiInsightsArticle,
    markdownUrl,
    titleFromMeta
  } = articleRoute;
  const {
    text: rawDoc,
    loading,
    error
  } = useMarkdownSource({
    url: markdownUrl,
    enabled: Boolean(docPath)
  });
  const { data: frontmatter, content } = useMemo(() => {
    if (!rawDoc) {
      return { data: {}, content: '' };
    }

    return parseMarkdownFrontmatter(rawDoc);
  }, [rawDoc]);
  const pageTitle = useMemo(
    () => buildDocPageTitle(docPath, titleFromMeta, frontmatter.title),
    [docPath, frontmatter.title, titleFromMeta]
  );
  const pageDescription = useMemo(
    () => buildDocPageDescription(frontmatter.description, pageTitle),
    [frontmatter.description, pageTitle]
  );
  const markdownContent = useMemo(() => {
    return buildNormalizedArticleMarkdown(content, {
      isAiInsightsArticle,
      stripTitle: stripAiInsightsTitle
    });
  }, [content, isAiInsightsArticle]);
  const historyRecord = useMemo(() => {
    return buildDocArticleHistoryRecord({
      articleRoute,
      pathname,
      frontmatter,
      rawDoc,
      error
    });
  }, [
    articleRoute,
    error,
    frontmatter,
    pathname,
    rawDoc
  ]);

  return {
    content,
    docMetaEntry,
    docPath,
    error,
    formattedContributors: formatContributors(docMetaEntry?.item?.contributors),
    formattedPublishedDate: formatPublishedDate(docMetaEntry?.item?.publishedAt),
    frontmatter,
    historyRecord,
    isAiInsightsArticle,
    isTranslatedArticle: Boolean(frontmatter.url && frontmatter.translated),
    loading,
    markdownContent,
    markdownUrl,
    pageDescription,
    pageTitle,
    rawDoc,
    titleFromMeta
  };
}
