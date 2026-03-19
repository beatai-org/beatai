import React, { useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import DocArticleLayout from '../docs/DocArticleLayout';
import {
  createMarkdownCodeComponent,
  createDocMarkdownComponents,
  createMarkdownPreComponent
} from '../docs/markdownRenderers';
import { useMarkdownSource } from '../../hooks/useMarkdownSource';
import { useRenderedHeadings } from '../../hooks/useRenderedHeadings';
import { resolvePublicContentUrl } from '../../utils/markdown';
import { getVersionDoc, transformVersionDocContent } from './docUtils';

function DocRenderer({ version }) {
  const doc = useMemo(() => getVersionDoc(version), [version]);
  const articleRef = useRef(null);
  const { text: rawContent, loading: contentLoading, error } = useMarkdownSource({
    url: doc?.contentPath ? resolvePublicContentUrl(doc.contentPath) : '',
    inlineContent: doc?.content || '',
    enabled: Boolean(doc)
  });
  const content = useMemo(
    () => transformVersionDocContent(version, rawContent),
    [rawContent, version]
  );
  const headings = useRenderedHeadings(articleRef, content, {
    enabled: Boolean(doc)
  });

  useEffect(() => {
    if (error) {
      console.error('Failed to load LLC markdown:', error);
    }
  }, [error]);

  if (!doc) {
    return null;
  }

  if (contentLoading && !rawContent) {
    return null;
  }

  const CodeComponent = createMarkdownCodeComponent();
  const PreComponent = createMarkdownPreComponent();
  const markdownComponents = createDocMarkdownComponents({
    codeComponent: CodeComponent,
    preComponent: PreComponent,
    includeH1: false
  });

  return (
    <DocArticleLayout
      articleRef={articleRef}
      articleClassName="doc-content lcc-doc-content"
      headings={headings}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
      <section className="lcc-copyright-card" aria-label="版权声明">
        <div className="lcc-copyright-card-title">版权声明</div>
        <p>
          本章节内容版权归属于原版 LCC：
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
    </DocArticleLayout>
  );
}

export default DocRenderer;
