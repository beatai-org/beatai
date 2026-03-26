import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import DocArticleHeader from '../docs/DocArticleHeader';
import DocArticleLayout from '../docs/DocArticleLayout';
import PaginationNav from '../docs/PaginationNav';
import { cn } from '../../utils/classNames';
import { useDocShortcuts } from '../../hooks/useDocShortcuts';
import { useMarkdownSource } from '../../hooks/useMarkdownSource';
import { useRenderedHeadings } from '../../hooks/useRenderedHeadings';
import { normalizeDocComponentMarkdown, resolvePublicContentUrl } from '../../utils/markdown';
import {
  createMarkdownCodeComponent,
  createDocMarkdownComponents,
  createMarkdownPreComponent,
  sanitizeSchema
} from '../docs/markdownRenderers';
import {
  ANNOTATIONS,
  LEARNING_PATH,
  VERSION_META,
  getFlowForVersion,
  zhMessages
} from '../../vendor/learn-claude-code/data';
import { SessionVisualization } from '../../vendor/learn-claude-code/visualizations/index.js';
import AgentLoopSimulator from './AgentLoopSimulator';
import DesignDecisions from './DesignDecisions';
import ExecutionFlow from './ExecutionFlow';
import { NotFoundState } from './NotFoundState';
import SourceViewer from './SourceViewer';
import GiscusComments from '../comments/GiscusComments';
import { getVersionDoc, transformVersionDocContent } from './docUtils';
import { getVersionData, getVersionPagination, getVersionTabs, safeSessionLabel } from './versionUtils';

function VersionPage() {
  const { version } = useParams();
  const [activeTab, setActiveTab] = useState('learn');
  const commentsRef = React.useRef(null);
  const articleTopRef = React.useRef(null);

  useEffect(() => {
    setActiveTab('learn');
  }, [version]);

  const isValidVersion = LEARNING_PATH.includes(version);

  const versionData = isValidVersion ? getVersionData(version) : null;
  const doc = useMemo(() => (isValidVersion ? getVersionDoc(version) : null), [isValidVersion, version]);
  const meta = isValidVersion ? VERSION_META[version] : null;
  const hasVisualization = isValidVersion && Boolean(zhMessages.viz?.[version]);
  const { prev: prevNav, next: nextNav } = isValidVersion
    ? getVersionPagination(version)
    : { prev: null, next: null };
  const tabs = isValidVersion ? getVersionTabs(version, versionData) : [];
  const { text: rawContent, loading: contentLoading, error } = useMarkdownSource({
    url: doc?.contentPath ? resolvePublicContentUrl(doc.contentPath) : '',
    inlineContent: doc?.content || '',
    enabled: Boolean(doc)
  });
  const markdownContent = useMemo(
    () => normalizeDocComponentMarkdown(transformVersionDocContent(version, rawContent)),
    [rawContent, version]
  );
  const headings = useRenderedHeadings(articleTopRef, markdownContent, {
    enabled: Boolean(doc) && activeTab === 'learn'
  });

  useDocShortcuts({
    articleRef: articleTopRef,
    commentsRef,
    prev: prevNav,
    next: nextNav,
    enabled: isValidVersion
  });

  useEffect(() => {
    if (error) {
      console.error('Failed to load learn-ai markdown:', error);
    }
  }, [error]);

  if (!isValidVersion) {
    return <NotFoundState label={version} />;
  }

  if (contentLoading && !rawContent && activeTab === 'learn') {
    return null;
  }

  const CodeComponent = createMarkdownCodeComponent();
  const PreComponent = createMarkdownPreComponent();
  const markdownComponents = createDocMarkdownComponents({
    codeComponent: CodeComponent,
    preComponent: PreComponent,
    includeH1: false
  });
  const pageTitle = safeSessionLabel(version);

  return (
    <DocArticleLayout
      articleRef={articleTopRef}
      articleClassName="doc-content lcc-doc-content"
      articleKey={`${version}-${activeTab}`}
      headings={headings}
      afterArticle={(
        <>
          <PaginationNav prev={prevNav} next={nextNav} />
          {activeTab === 'learn' ? (
            <GiscusComments
              className="lcc-comments"
              pageTitle={pageTitle}
              containerRef={commentsRef}
            />
          ) : null}
        </>
      )}
    >
      <DocArticleHeader
        title={pageTitle}
        meta={(
          <div className="lcc-version-meta">
            {version === 'preface' ? (
              <section className="lcc-copyright-card" aria-label="版权声明">
                <div className="lcc-copyright-card-title">版权声明</div>
                <p>
                  版权归属于原版 LCC：
                  <a
                    className="doc-link"
                    href="https://github.com/shareAI-lab/learn-claude-code"
                    target="_blank"
                    rel="noreferrer"
                  >
                    shareAI-lab/learn-claude-code
                  </a>
                </p>
              </section>
            ) : null}
            <p className="lcc-version-subtitle">{meta.subtitle}</p>
            <blockquote className="doc-blockquote lcc-version-quote">{meta.keyInsight}</blockquote>
          </div>
        )}
      />

      {hasVisualization ? (
        <section className="lcc-hero-shell">
          <SessionVisualization version={version} />
        </section>
      ) : null}

      {tabs.length > 1 ? (
        <div className="lcc-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cn(activeTab === tab.id && 'active')}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="lcc-tab-panel">
        {activeTab === 'learn' && (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
            components={markdownComponents}
          >
            {markdownContent}
          </ReactMarkdown>
        )}
        {activeTab === 'simulate' && <AgentLoopSimulator version={version} />}
        {activeTab === 'code' && (
          <SourceViewer source={versionData.source} filename={versionData.filename} />
        )}
        {activeTab === 'deep-dive' && (
          <div className="lcc-stack">
            <section>
              <h3 className="lcc-block-title">{zhMessages.version.execution_flow}</h3>
              <ExecutionFlow flow={getFlowForVersion(version)} />
            </section>
            <DesignDecisions annotations={ANNOTATIONS[version]} messages={zhMessages} />
          </div>
        )}
      </div>
    </DocArticleLayout>
  );
}

export default VersionPage;
