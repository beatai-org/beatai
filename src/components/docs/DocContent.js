import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize from 'rehype-sanitize';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import CodePlayground from './CodePlayground';
import DocArticleHeader from './DocArticleHeader';
import PaginationNav from './PaginationNav';
import ArticleTags from './ArticleTags';
import ArticleSourceCard from './ArticleSourceCard';
import DocArticleLayout from './DocArticleLayout';
import GiscusComments from '../comments/GiscusComments';
import PageSeo from '../seo/PageSeo';
import { formatDocErrorMessage } from './docContentUtils';
import {
  createMarkdownCodeComponent,
  createDocMarkdownComponents,
  createMarkdownPreComponent,
  sanitizeSchema
} from './markdownRenderers';
import { useDocArticleModel } from './useDocArticleModel';
import { useDocArticleNavigation } from './useDocArticleNavigation';
import { usePageTitle } from '../../contexts/PageTitleContext';
import { useMeta } from '../../contexts/MetaContext';
import { useHistory } from '../../contexts/HistoryContext';
import { useTag } from '../../contexts/TagContext';
import { useDocShortcuts } from '../../hooks/useDocShortcuts';
import { useRenderedHeadings } from '../../hooks/useRenderedHeadings';
import { buildDocsTitle } from '../../utils/siteConfig';

const DocContent = () => {
  const location = useLocation();
  const { setPageTitle, findTitleByPath } = usePageTitle();
  const { meta } = useMeta();
  const { recordVisit } = useHistory();
  const { findArticleTags } = useTag();
  const articleRef = React.useRef(null);
  const commentsRef = React.useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState([]);
  const {
    content,
    docMetaEntry,
    docPath,
    error,
    formattedContributors,
    formattedPublishedDate,
    frontmatter,
    historyRecord,
    isAiInsightsArticle,
    isTranslatedArticle,
    markdownContent,
    markdownUrl,
    pageDescription,
    pageTitle,
    rawDoc
  } = useDocArticleModel({
    meta,
    pathname: location.pathname,
    findTitleByPath
  });

  useEffect(() => {
    if (error || !rawDoc) {
      return;
    }

    setPageTitle(pageTitle);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [error, pageTitle, rawDoc, setPageTitle]);

  // 仅记录真正的文章页（meta 中的叶子条目），并带上所属上级分类。
  useEffect(() => {
    if (!historyRecord) {
      return;
    }

    recordVisit(historyRecord);
  }, [historyRecord, recordVisit]);

  const headings = useRenderedHeadings(articleRef, content, {
    enabled: Boolean(content)
  });

  const { adjacentChapters, articleTags } = useDocArticleNavigation({
    meta,
    pathname: location.pathname,
    docMetaEntry,
    findArticleTags
  });

  useDocShortcuts({
    articleRef,
    commentsRef,
    prev: adjacentChapters.prev,
    next: adjacentChapters.next,
    enabled: Boolean(rawDoc)
  });

  const openImageLightbox = ({ src, alt }) => {
    if (!src) {
      return;
    }

    setLightboxSlides([{ src, alt: alt || '' }]);
    setLightboxOpen(true);
  };

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
    preComponent: PreComponent,
    markdownUrl,
    onImageClick: openImageLightbox
  });

  return (
    <>
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        titleBuilder={buildDocsTitle}
        openGraphTitle={pageTitle}
        openGraphDescription={pageDescription}
      />

      <DocArticleLayout
        articleRef={articleRef}
        articleClassName="doc-content"
        articleKey={docPath}
        headings={headings}
        afterArticle={(
          <>
            <ArticleTags tags={articleTags} />
            <PaginationNav prev={adjacentChapters.prev} next={adjacentChapters.next} />
            {!isAiInsightsArticle && (
              <GiscusComments pageTitle={pageTitle} containerRef={commentsRef} />
            )}
          </>
        )}
      >
        {isAiInsightsArticle && (
          <DocArticleHeader
            title={pageTitle}
            meta={formattedPublishedDate || formattedContributors.length ? (
              <div className="doc-article-meta" aria-label="文章发布时间和署名">
                {formattedPublishedDate ? (
                  <time className="doc-article-meta-value" dateTime={docMetaEntry?.item?.publishedAt}>
                    {formattedPublishedDate}
                  </time>
                ) : null}
                {formattedContributors.map((contributor, index) => (
                  <React.Fragment key={contributor.key}>
                    <span className="doc-article-meta-separator" aria-hidden="true">
                      {formattedPublishedDate || index > 0 ? '·' : ''}
                    </span>
                    <span className="doc-article-meta-credit">
                      <span className="doc-article-meta-credit-label">{contributor.label}</span>
                      {' '}
                      <span className="doc-article-meta-credit-from">By</span>
                      {' '}
                      {contributor.link ? (
                        <a
                          className="doc-article-meta-credit-name"
                          href={contributor.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {contributor.name}
                        </a>
                      ) : (
                        <span className="doc-article-meta-credit-name">{contributor.name}</span>
                      )}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            ) : null}
          />
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkCjkFriendly, remarkMath]}
          rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema], rehypeKatex]}
          components={markdownComponents}
        >
          {markdownContent}
        </ReactMarkdown>
        {isTranslatedArticle && (
          <ArticleSourceCard url={frontmatter.url} />
        )}
      </DocArticleLayout>
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        plugins={[Zoom]}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 1.8,
          scrollToZoom: true
        }}
      />
    </>
  );
};

export default DocContent;
