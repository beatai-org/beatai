import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import './GiscusComments.css';

const GISCUS_ORIGIN = 'https://giscus.app';
const BEATAI_GISCUS_CONFIG = {
  repo: process.env.REACT_APP_GISCUS_REPO || 'beatai-org/BeatAI',
  repoId: process.env.REACT_APP_GISCUS_REPO_ID || 'R_kgDOGmKA_Q',
  category: process.env.REACT_APP_GISCUS_CATEGORY || 'giscus',
  categoryId: process.env.REACT_APP_GISCUS_CATEGORY_ID || 'DIC_kwDOGmKA_c4COcYR',
  discussionsUrl: process.env.REACT_APP_GISCUS_DISCUSSIONS_URL ||
    'https://github.com/beatai-org/BeatAI/discussions/categories/giscus'
};
const RUST_COURSE_GISCUS_CONFIG = {
  repo: process.env.REACT_APP_RUST_COURSE_GISCUS_REPO || 'sunface/rust-course',
  repoId: process.env.REACT_APP_RUST_COURSE_GISCUS_REPO_ID || 'MDEwOlJlcG9zaXRvcnkxNDM4MjIwNjk=',
  category: process.env.REACT_APP_RUST_COURSE_GISCUS_CATEGORY || '章节评论区',
  categoryId: process.env.REACT_APP_RUST_COURSE_GISCUS_CATEGORY_ID || 'DIC_kwDOCJKM9c4COQcP',
  discussionsUrl: process.env.REACT_APP_RUST_COURSE_GISCUS_DISCUSSIONS_URL ||
    'https://github.com/sunface/rust-course/discussions/categories/%E7%AB%A0%E8%8A%82%E8%AF%84%E8%AE%BA%E5%8C%BA'
};

function buildGiscusTheme(mode) {
  return mode === 'dark' ? 'noborder_dark' : 'noborder_light';
}

function getGiscusConfig(pathname) {
  return pathname.startsWith('/rust-course')
    ? RUST_COURSE_GISCUS_CONFIG
    : BEATAI_GISCUS_CONFIG;
}

function buildDiscussionUrl(pathname, pageTitle, config) {
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
    category: config.category,
    title: discussionTitle,
    body: discussionBody
  });

  return `${config.repo ? `https://github.com/${config.repo}/discussions/new` : config.discussionsUrl}?${searchParams.toString()}`;
}

function GiscusComments({ pageTitle = '' }) {
  const containerRef = useRef(null);
  const location = useLocation();
  const { theme } = useTheme();
  const giscusTheme = useMemo(() => buildGiscusTheme(theme), [theme]);

  const pathname = location.pathname || '/';
  const giscusConfig = useMemo(() => getGiscusConfig(pathname), [pathname]);
  const discussionUrl = useMemo(
    () => buildDiscussionUrl(pathname, pageTitle, giscusConfig),
    [giscusConfig, pageTitle, pathname]
  );
  const isEmbeddedMode = Boolean(
    giscusConfig.repo &&
    giscusConfig.repoId &&
    giscusConfig.category &&
    giscusConfig.categoryId
  );

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
    script.setAttribute('data-repo', giscusConfig.repo);
    script.setAttribute('data-repo-id', giscusConfig.repoId);
    script.setAttribute('data-category', giscusConfig.category);
    script.setAttribute('data-category-id', giscusConfig.categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', giscusTheme);
    script.setAttribute('data-lang', 'zh-CN');
    // script.setAttribute('data-loading', 'lazy');

    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [giscusConfig, giscusTheme, isEmbeddedMode, pathname]);

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
            theme: giscusTheme
          }
        }
      },
      GISCUS_ORIGIN
    );
  }, [giscusTheme, isEmbeddedMode]);

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
