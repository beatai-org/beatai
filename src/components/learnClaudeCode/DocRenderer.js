import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import DocArticleLayout from '../docs/DocArticleLayout';
import {
  createMarkdownCodeComponent,
  createDocMarkdownComponents,
  createMarkdownPreComponent
} from '../docs/markdownRenderers';
import { useRenderedHeadings } from '../../hooks/useRenderedHeadings';
import { resolvePublicContentUrl } from '../../utils/markdown';
import { docsData } from '../../vendor/learn-claude-code/data';

function getVersionDoc(version, locale = 'zh') {
  return (
    docsData.find((item) => item.version === version && item.locale === locale) ||
    docsData.find((item) => item.version === version && item.locale === 'en') ||
    null
  );
}

function stripLearningPathCode(content) {
  return String(content || '').replace(
    /\n\n`(?=[^`\n]*(?:s01|s02|s03|s04|s05|s06|s07|s08|s09|s10|s11|s12))[^`\n]*`\n\n/i,
    '\n\n'
  );
}

function trimPrefaceContent(version, content) {
  if (version !== 'preface') {
    return String(content || '');
  }

  const marker = '\n## 快速开始';
  const normalized = String(content || '');
  const markerIndex = normalized.indexOf(marker);

  return markerIndex >= 0 ? normalized.slice(0, markerIndex).trimEnd() : normalized;
}

function renameBookTitle(content) {
  return String(content || '').replace(
    /^# Learn Claude Code\b/m,
    '# CC宝典'
  );
}

function DocRenderer({ version }) {
  const doc = useMemo(() => getVersionDoc(version), [version]);
  const articleRef = useRef(null);
  const [rawContent, setRawContent] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const content = useMemo(
    () => renameBookTitle(trimPrefaceContent(version, stripLearningPathCode(rawContent))),
    [rawContent, version]
  );
  const headings = useRenderedHeadings(articleRef, content, {
    enabled: Boolean(doc)
  });

  useEffect(() => {
    if (!doc) {
      setRawContent('');
      setContentLoading(false);
      return undefined;
    }

    if (doc.contentPath) {
      const controller = new AbortController();
      const url = resolvePublicContentUrl(doc.contentPath);

      setRawContent('');
      setContentLoading(true);

      fetch(url, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.text();
        })
        .then((text) => {
          setRawContent(text);
          setContentLoading(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Failed to load LLC markdown:', err);
            setRawContent('');
            setContentLoading(false);
          }
        });

      return () => controller.abort();
    }

    setRawContent(doc.content || '');
    setContentLoading(false);
    return undefined;
  }, [doc]);

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
