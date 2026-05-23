import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import {
  buildAbsoluteSiteUrl,
  SITE_CONFIG
} from '../../utils/siteConfig';

const { giscus: GISCUS_CONFIG, links: SITE_LINKS, labels: SITE_LABELS } = SITE_CONFIG;

function buildGiscusTheme(mode) {
  return mode === 'dark' ? 'noborder_dark' : 'noborder_light';
}

function getGiscusConfig(pathname) {
  return pathname.startsWith('/rust-course')
    ? GISCUS_CONFIG.rustCourse
    : GISCUS_CONFIG.default;
}

function buildDiscussionUrl(pathname, pageTitle, config) {
  const normalizedPath = pathname || '/';
  const pageUrl = buildAbsoluteSiteUrl(normalizedPath);
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

function GiscusComments({ className = '', pageTitle = '', containerRef: sectionRef = null }) {
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
    script.src = `${SITE_LINKS.giscusOrigin}/client.js`;
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
      SITE_LINKS.giscusOrigin
    );
  }, [giscusTheme, isEmbeddedMode]);

  return (
    <section
      ref={sectionRef}
      className={['doc-comments', className].filter(Boolean).join(' ')}
      aria-label="文章评论"
    >
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
              {SITE_LABELS.githubDiscussions}
            </a>
          </p>
        </div>
      )}
    </section>
  );
}

export default GiscusComments;
