import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import './GiscusComments.css';

const GISCUS_ORIGIN = 'https://giscus.app';
const DEFAULT_REPO = process.env.REACT_APP_GISCUS_REPO || 'beatai-org/BeatAI';
const DEFAULT_REPO_ID = process.env.REACT_APP_GISCUS_REPO_ID || 'R_kgDOGmKA_Q';
const DEFAULT_CATEGORY = process.env.REACT_APP_GISCUS_CATEGORY || 'giscus';
const DEFAULT_CATEGORY_ID = process.env.REACT_APP_GISCUS_CATEGORY_ID || 'DIC_kwDOGmKA_c4COcYR';
const DEFAULT_DISCUSSIONS_URL = process.env.REACT_APP_GISCUS_DISCUSSIONS_URL ||
  'https://github.com/beatai-org/BeatAI/discussions/categories/giscus';

function resolveGiscusTheme(themeMode) {
  return themeMode === 'dark' ? 'dark' : 'light';
}

function buildDiscussionUrl(pathname, pageTitle) {
  const normalizedPath = pathname || '/';
  const pageUrl = `https://beatai.org${normalizedPath}`;
  const discussionTitle = `评论：${pageTitle || normalizedPath}`;
  const discussionBody = [
    `页面：${pageTitle || normalizedPath}`,
    '',
    `链接：${pageUrl}`,
    '',
    '欢迎在这里留下你的评论、勘误或补充。'
  ].join('\n');

  const searchParams = new URLSearchParams({
    category: DEFAULT_CATEGORY,
    title: discussionTitle,
    body: discussionBody
  });

  return `${DEFAULT_REPO ? `https://github.com/${DEFAULT_REPO}/discussions/new` : DEFAULT_DISCUSSIONS_URL}?${searchParams.toString()}`;
}

function GiscusComments({ pageTitle = '' }) {
  const containerRef = useRef(null);
  const initialThemeRef = useRef(null);
  const location = useLocation();
  const { theme } = useTheme();

  if (initialThemeRef.current === null) {
    initialThemeRef.current = resolveGiscusTheme(theme);
  }

  const pathname = location.pathname || '/';
  const discussionUrl = useMemo(
    () => buildDiscussionUrl(pathname, pageTitle),
    [pageTitle, pathname]
  );
  const isEmbeddedMode = Boolean(DEFAULT_REPO && DEFAULT_REPO_ID && DEFAULT_CATEGORY && DEFAULT_CATEGORY_ID);

  useEffect(() => {
    if (!isEmbeddedMode || !containerRef.current) {
      return undefined;
    }

    const container = containerRef.current;
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = `${GISCUS_ORIGIN}/client.js`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', DEFAULT_REPO);
    script.setAttribute('data-repo-id', DEFAULT_REPO_ID);
    script.setAttribute('data-category', DEFAULT_CATEGORY);
    script.setAttribute('data-category-id', DEFAULT_CATEGORY_ID);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', initialThemeRef.current);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');

    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [isEmbeddedMode, pathname]);

  useEffect(() => {
    if (!isEmbeddedMode) {
      return;
    }

    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe?.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: resolveGiscusTheme(theme)
          }
        }
      },
      GISCUS_ORIGIN
    );
  }, [isEmbeddedMode, theme]);

  return (
    <section className="doc-comments" aria-label="文章评论">
      {isEmbeddedMode ? (
        <div ref={containerRef} className="doc-comments-embed" />
      ) : (
        <div className="doc-comments-fallback">
          <p className="doc-comments-fallback-copy">
            评论区已预留在此处。当前站点尚未填入 `giscus` 的内部 ID，
            你仍然可以通过上方按钮为这篇文章发起讨论。
          </p>
          <p className="doc-comments-fallback-note">
            补齐 `REACT_APP_GISCUS_REPO_ID` 和 `REACT_APP_GISCUS_CATEGORY_ID` 后，
            这里会自动升级为站内嵌入评论。
          </p>
          <p className="doc-comments-fallback-note">
            当前文章讨论入口：
            <a
              className="doc-link"
              href={discussionUrl}
              target="_blank"
              rel="noreferrer"
            >
              GitHub Discussions
            </a>
          </p>
        </div>
      )}
    </section>
  );
}

export default GiscusComments;
