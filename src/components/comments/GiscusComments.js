import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import './GiscusComments.css';

const GISCUS_ORIGIN = 'https://giscus.app';
const DEFAULT_REPO = process.env.REACT_APP_GISCUS_REPO || 'sunface/rust-course';
const DEFAULT_REPO_ID = process.env.REACT_APP_GISCUS_REPO_ID || 'MDEwOlJlcG9zaXRvcnkxNDM4MjIwNjk=';
// 'R_kgDOGmKA_Q'
const DEFAULT_CATEGORY = process.env.REACT_APP_GISCUS_CATEGORY || '章节评论区';
const DEFAULT_CATEGORY_ID = process.env.REACT_APP_GISCUS_CATEGORY_ID || 'DIC_kwDOCJKM9c4COQcP';
// 'DIC_kwDOGmKA_c4COcYR'
const DEFAULT_DISCUSSIONS_URL = process.env.REACT_APP_GISCUS_DISCUSSIONS_URL ||
  'https://github.com/sunface/rust-course/discussions/categories/giscus';
const DEFAULT_GISCUS_THEME_ID = 'classic-mono';

function normalizeColor(value, fallback) {
  const normalized = String(value || '').trim();
  return normalized || fallback;
}

function hexToRgba(hex, alpha) {
  const normalized = String(hex || '').trim();
  const matched = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

  if (!matched) {
    return hex;
  }

  const raw = matched[1].length === 3
    ? matched[1].split('').map((char) => `${char}${char}`).join('')
    : matched[1];
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* eslint-disable no-unused-vars */
function buildGiscusThemeCss(mode) {
  if (typeof window === 'undefined') {
    return '';
  }

  const styles = window.getComputedStyle(document.documentElement);
  const accentStart = normalizeColor(styles.getPropertyValue('--accent-start'), mode === 'dark' ? '#60a5fa' : '#2563eb');
  const accentEnd = normalizeColor(styles.getPropertyValue('--accent-end'), mode === 'dark' ? '#a78bfa' : '#7c3aed');
  const accentPrimary = normalizeColor(styles.getPropertyValue('--accent-primary'), accentStart);
  const accentSecondary = normalizeColor(styles.getPropertyValue('--accent-secondary'), accentEnd);

  const palette = mode === 'dark'
    ? {
        fgDefault: '#e5edf7',
        fgMuted: '#97a3b6',
        fgSubtle: '#7d889b',
        canvasDefault: '#0d1118',
        canvasOverlay: '#121822',
        canvasInset: '#090d14',
        canvasSubtle: '#151d29',
        borderDefault: hexToRgba(accentStart, 0.18),
        borderMuted: 'rgba(255, 255, 255, 0.08)',
        neutralMuted: 'rgba(148, 163, 184, 0.16)',
        accentSubtle: `linear-gradient(135deg, ${hexToRgba(accentStart, 0.18)}, ${hexToRgba(accentEnd, 0.12)})`,
        buttonBg: 'rgba(255, 255, 255, 0.04)',
        buttonHoverBg: 'rgba(255, 255, 255, 0.08)',
        buttonSelectedBg: 'rgba(255, 255, 255, 0.1)',
        buttonPrimaryText: '#f8fbff',
        buttonPrimaryBg: accentPrimary,
        buttonPrimaryHoverBg: accentSecondary,
        buttonPrimarySelectedBg: accentSecondary,
        reactionBg: 'rgba(255, 255, 255, 0.06)',
        reactionBgReacted: hexToRgba(accentStart, 0.22),
        commentBg: `linear-gradient(135deg, ${hexToRgba(accentStart, 0.08)}, ${hexToRgba(accentEnd, 0.05)})`,
        commentBorder: hexToRgba(accentStart, 0.2),
        commentInset: 'rgba(255, 255, 255, 0.04)',
        commentBoxShell: `linear-gradient(180deg, rgba(17, 24, 35, 0.96), rgba(10, 14, 22, 0.98))`,
        commentBoxSurface: `linear-gradient(180deg, rgba(20, 28, 40, 0.98), rgba(12, 18, 28, 0.98))`,
        commentBoxTabBg: `linear-gradient(135deg, ${hexToRgba(accentStart, 0.16)}, ${hexToRgba(accentEnd, 0.1)})`,
        commentBoxInput: 'rgba(8, 12, 19, 0.96)',
        commentBoxFooter: `linear-gradient(180deg, rgba(255, 255, 255, 0.01), ${hexToRgba(accentPrimary, 0.08)})`,
        commentBoxBorder: hexToRgba(accentStart, 0.24),
        commentBoxGlow: `${hexToRgba(accentStart, 0.14)}`,
        panelBg: `linear-gradient(180deg, rgba(16, 22, 31, 0.94), rgba(11, 15, 22, 0.98))`,
        panelBgRaised: `linear-gradient(180deg, rgba(21, 29, 41, 0.96), rgba(13, 18, 27, 0.98))`,
        panelShadow: 'rgba(0, 0, 0, 0.28)',
        rail: hexToRgba(accentStart, 0.24),
        codeBg: 'rgba(255, 255, 255, 0.05)',
        preBg: 'rgba(7, 10, 16, 0.88)',
        inputBg: 'rgba(10, 14, 21, 0.94)',
        inputShadow: hexToRgba(accentStart, 0.12),
        headerBg: `linear-gradient(135deg, ${hexToRgba(accentStart, 0.12)}, ${hexToRgba(accentEnd, 0.08)})`,
        softGlow: hexToRgba(accentStart, 0.08)
      }
    : {
        fgDefault: '#172033',
        fgMuted: '#5c6c82',
        fgSubtle: '#6d7c91',
        canvasDefault: '#ffffff',
        canvasOverlay: '#fdfefe',
        canvasInset: '#f4f8fd',
        canvasSubtle: '#f7fbff',
        borderDefault: hexToRgba(accentPrimary, 0.22),
        borderMuted: 'rgba(15, 23, 42, 0.08)',
        neutralMuted: 'rgba(59, 130, 246, 0.10)',
        accentSubtle: `linear-gradient(135deg, ${hexToRgba(accentStart, 0.14)}, ${hexToRgba(accentEnd, 0.1)})`,
        buttonBg: '#f8fbff',
        buttonHoverBg: '#eef5ff',
        buttonSelectedBg: '#e7f0ff',
        buttonPrimaryText: '#ffffff',
        buttonPrimaryBg: accentPrimary,
        buttonPrimaryHoverBg: accentSecondary,
        buttonPrimarySelectedBg: accentSecondary,
        reactionBg: 'rgba(59, 130, 246, 0.08)',
        reactionBgReacted: hexToRgba(accentPrimary, 0.18),
        commentBg: `linear-gradient(135deg, ${hexToRgba(accentStart, 0.08)}, ${hexToRgba(accentEnd, 0.05)})`,
        commentBorder: hexToRgba(accentPrimary, 0.16),
        commentInset: 'rgba(255, 255, 255, 0.72)',
        commentBoxShell: `linear-gradient(180deg, rgba(255, 255, 255, 0.99), rgba(244, 249, 255, 0.99))`,
        commentBoxSurface: `linear-gradient(180deg, rgba(251, 253, 255, 0.99), rgba(241, 247, 255, 0.98))`,
        commentBoxTabBg: `linear-gradient(135deg, ${hexToRgba(accentStart, 0.14)}, ${hexToRgba(accentEnd, 0.1)})`,
        commentBoxInput: '#ffffff',
        commentBoxFooter: `linear-gradient(180deg, rgba(255, 255, 255, 0.65), ${hexToRgba(accentPrimary, 0.05)})`,
        commentBoxBorder: hexToRgba(accentPrimary, 0.2),
        commentBoxGlow: `${hexToRgba(accentPrimary, 0.12)}`,
        panelBg: `linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 255, 0.98))`,
        panelBgRaised: `linear-gradient(180deg, rgba(250, 252, 255, 0.99), rgba(243, 248, 255, 0.98))`,
        panelShadow: hexToRgba(accentPrimary, 0.1),
        rail: hexToRgba(accentPrimary, 0.2),
        codeBg: hexToRgba(accentPrimary, 0.08),
        preBg: '#f6f9fe',
        inputBg: '#ffffff',
        inputShadow: hexToRgba(accentPrimary, 0.08),
        headerBg: `linear-gradient(135deg, ${hexToRgba(accentStart, 0.12)}, ${hexToRgba(accentEnd, 0.08)})`,
        softGlow: hexToRgba(accentPrimary, 0.06)
      };

  const css = `

`;

  return css;
}
/* eslint-enable no-unused-vars */

function buildGiscusTheme(mode) {
  if (typeof window === 'undefined') {
    return mode === 'dark' ? 'dark' : 'light';
  }

  const themeId =
    document.documentElement.getAttribute('data-theme') ||
    window.localStorage.getItem('docs-theme') ||
    DEFAULT_GISCUS_THEME_ID;
  const styles = window.getComputedStyle(document.documentElement);
  const textPrimary = normalizeColor(
    styles.getPropertyValue('--text-primary'),
    mode === 'dark' ? '#e5edf7' : '#172033'
  );
  const textSecondary = normalizeColor(
    styles.getPropertyValue('--text-secondary'),
    mode === 'dark' ? '#97a3b6' : '#5c6c82'
  );
  const textTertiary = normalizeColor(
    styles.getPropertyValue('--text-tertiary'),
    mode === 'dark' ? '#7d889b' : '#6d7c91'
  );
  const textPrimarySoft = mode === 'dark' ? textSecondary : textPrimary;
  const baseThemeUrl = new URL(
    `/giscus-themes/${themeId}-${mode === 'dark' ? 'dark' : 'light'}.css`,
    window.location.origin
  ).href;
  const css = `
@import url("${baseThemeUrl}");
main {
  --color-fg-default: ${textPrimarySoft};
  --color-fg-muted: ${textSecondary};
  --color-fg-subtle: ${textTertiary};
}
main .gsc-main,
main .gsc-main .color-text-primary {
  color: ${textPrimarySoft} !important;
}
main .gsc-main .color-text-secondary,
main .gsc-main .color-fg-muted {
  color: ${textSecondary} !important;
}
main .gsc-main .color-text-tertiary,
main .gsc-main .color-fg-subtle {
  color: ${textTertiary} !important;
}
`;

  return `data:text/css;charset=utf-8,${encodeURIComponent(css)}`;
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
  const giscusThemeRef = useRef('');
  const location = useLocation();
  const { theme } = useTheme();
  const [giscusTheme, setGiscusTheme] = useState(() => buildGiscusTheme(theme));

  const pathname = location.pathname || '/';
  const discussionUrl = useMemo(
    () => buildDiscussionUrl(pathname, pageTitle),
    [pageTitle, pathname]
  );
  const isEmbeddedMode = Boolean(DEFAULT_REPO && DEFAULT_REPO_ID && DEFAULT_CATEGORY && DEFAULT_CATEGORY_ID);

  useEffect(() => {
    giscusThemeRef.current = giscusTheme;
  }, [giscusTheme]);

  useEffect(() => {
    setGiscusTheme(buildGiscusTheme(theme));
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setGiscusTheme(buildGiscusTheme(root.getAttribute('data-theme-mode') === 'dark' ? 'dark' : 'light'));
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-theme-mode', 'style']
    });

    return () => {
      observer.disconnect();
    };
  }, []);

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
    script.setAttribute('data-theme', giscusThemeRef.current);
    script.setAttribute('data-lang', 'zh-CN');
    // script.setAttribute('data-loading', 'lazy');

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
