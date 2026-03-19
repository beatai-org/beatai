import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import matter from 'gray-matter';
import '../../styles/prism-custom.css';
import CodePlayground from './CodePlayground';
import PaginationNav from './PaginationNav';
import ArticleTags from './ArticleTags';
import DocArticleLayout from './DocArticleLayout';
import {
  createMarkdownCodeComponent,
  createDocMarkdownComponents,
  createMarkdownPreComponent,
  sanitizeSchema
} from './markdownRenderers';
import { usePageTitle } from '../../contexts/PageTitleContext';
import { useMeta } from '../../contexts/MetaContext';
import { useTag } from '../../contexts/TagContext';
import { useMarkdownSource } from '../../hooks/useMarkdownSource';
import { useRenderedHeadings } from '../../hooks/useRenderedHeadings';
import { findMetaEntryByPath } from '../../utils/docsMeta';
import { resolvePublicContentUrl } from '../../utils/markdown';
import { flattenChapters, getAdjacentChapters } from '../../utils/navigationHelpers';
import './DocContent.css';
import '../../styles/3d-effects.css';
import '../../styles/animations.css';

const formatPublishedDate = (publishedAt) => {
  if (!publishedAt) {
    return '';
  }

  const [year, month, day] = publishedAt.split('-').map(Number);
  if (!year || !month || !day) {
    return publishedAt;
  }

  return `${year}年${month}月${day}日`;
};

const formatDocErrorMessage = (error) => {
  if (!error?.message) {
    return 'Document not found';
  }

  return error.message === 'HTTP error! status: 404' ? 'Document not found' : error.message;
};

const DocContent = () => {
  const location = useLocation();
  const { setPageTitle, findTitleByPath } = usePageTitle();
  const { meta } = useMeta();
  const { findArticleTags } = useTag();
  const articleRef = React.useRef(null);
  const [adjacentChapters, setAdjacentChapters] = useState({ prev: null, next: null });
  const [articleTags, setArticleTags] = useState([]);

  // Extract the path from URL (now starts from root)
  const docPath = location.pathname.replace(/^\//, '');
  const docMetaEntry = useMemo(() => findMetaEntryByPath(meta, location.pathname), [meta, location.pathname]);
  const isAiInsightsArticle = docMetaEntry?.category?.id === 'ai-insights';
  const formattedPublishedDate = formatPublishedDate(docMetaEntry?.item?.publishedAt);
  const titleFromMeta = docMetaEntry?.item?.title || findTitleByPath(location.pathname);
  const { text: rawDoc, error } = useMarkdownSource({
    url: resolvePublicContentUrl(`/docs/${docPath}.md`),
    enabled: Boolean(docPath)
  });
  const { data: frontmatter, content } = useMemo(() => {
    if (!rawDoc) {
      return { data: {}, content: '' };
    }

    return matter(rawDoc);
  }, [rawDoc]);

  useEffect(() => {
    if (error || !rawDoc) {
      return;
    }

    const title = titleFromMeta || frontmatter.title || docPath.split('/').pop()?.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || 'Untitled';

    setPageTitle(title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [docPath, error, frontmatter.title, rawDoc, setPageTitle, titleFromMeta]);

  const headings = useRenderedHeadings(articleRef, content, {
    enabled: Boolean(content)
  });

  // Calculate adjacent chapters for pagination
  useEffect(() => {
    if (!meta) return;

    const chapters = flattenChapters(meta);
    const adjacent = getAdjacentChapters(chapters, location.pathname);
    setAdjacentChapters(adjacent);

    // Find tags for current article
        const tags = docMetaEntry?.item?.tags || findArticleTags(location.pathname);
        setArticleTags(tags);
  }, [meta, location.pathname, findArticleTags, docMetaEntry]);

  const markdownContent = useMemo(() => {
    if (!isAiInsightsArticle) {
      return content;
    }

    return content.replace(/^\s*#\s+.+?(?:\r?\n){1,2}/, '');
  }, [content, isAiInsightsArticle]);

  if (error) {
    return (
      <div className="doc-error">
        <h1>Document Not Found</h1>
        <p>{formatDocErrorMessage(error)}</p>
      </div>
    );
  }

  const CodeComponent = createMarkdownCodeComponent({
    playgroundRenderer: ({ code, language }) => (
      <CodePlayground initialCode={code} language={language} />
    )
  });
  const PreComponent = createMarkdownPreComponent();
  const markdownComponents = createDocMarkdownComponents({
    codeComponent: CodeComponent,
    preComponent: PreComponent
  });

  // Prepare page title and description with fallbacks
  const slug = docPath.split('/').pop() || 'documentation';
  const pageTitle = titleFromMeta || frontmatter.title || slug.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  const pageDescription = frontmatter.description || `Documentation for ${pageTitle}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle} | BeatAI Docs</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
      </Helmet>

      <DocArticleLayout
        articleRef={articleRef}
        articleClassName="doc-content"
        articleKey={docPath}
        headings={headings}
        afterArticle={(
          <>
            <ArticleTags tags={articleTags} />
            <PaginationNav prev={adjacentChapters.prev} next={adjacentChapters.next} />
          </>
        )}
      >
        {isAiInsightsArticle && (
          <header className="doc-article-header">
            <h1 className="doc-h1">{pageTitle}</h1>
            {formattedPublishedDate && (
              <div className="doc-article-meta" aria-label="文章发布时间">
                <time className="doc-article-meta-value" dateTime={docMetaEntry?.item?.publishedAt}>
                  {formattedPublishedDate}
                </time>
              </div>
            )}
          </header>
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
          components={markdownComponents}
        >
          {markdownContent}
        </ReactMarkdown>
      </DocArticleLayout>
    </>
  );
};

export default DocContent;
