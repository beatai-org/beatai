import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { AI_INSIGHTS_PATH } from '../utils/siteRoutes';

export const AI_INSIGHTS_SCROLL_STATE_KEY = 'beatAiAiInsightsScroll';

const MAX_SCROLL_STATE_AGE_MS = 24 * 60 * 60 * 1000;

function canUseDOM() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getScrollY() {
  if (!canUseDOM()) {
    return 0;
  }

  return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
}

function isPrimaryNavigationEvent(event) {
  if (!event) {
    return true;
  }

  if (event.defaultPrevented) {
    return false;
  }

  if (event.button && event.button !== 0) {
    return false;
  }

  return !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

function findArticleElement(articlePath) {
  if (!articlePath || !canUseDOM()) {
    return null;
  }

  return Array.from(document.querySelectorAll('[data-ai-insights-article-path]'))
    .find((element) => element.getAttribute('data-ai-insights-article-path') === articlePath) || null;
}

function getHistoryScrollState() {
  if (!canUseDOM()) {
    return null;
  }

  return window.history.state?.[AI_INSIGHTS_SCROLL_STATE_KEY] || null;
}

function writeHistoryScrollState(scrollState) {
  if (!canUseDOM()) {
    return;
  }

  const currentState = window.history.state && typeof window.history.state === 'object'
    ? window.history.state
    : {};

  try {
    window.history.replaceState({
      ...currentState,
      [AI_INSIGHTS_SCROLL_STATE_KEY]: scrollState
    }, document.title);
  } catch {
    // Browsers can reject replaceState in unusual embedded contexts.
  }
}

function isValidScrollState(scrollState, location) {
  if (!scrollState || typeof scrollState !== 'object') {
    return false;
  }

  if (scrollState.pathname !== location.pathname || scrollState.search !== location.search) {
    return false;
  }

  if (!Number.isFinite(scrollState.scrollY)) {
    return false;
  }

  if (!Number.isFinite(scrollState.savedAt)) {
    return false;
  }

  return Date.now() - scrollState.savedAt < MAX_SCROLL_STATE_AGE_MS;
}

export function getAiInsightsRestoreTarget(scrollState) {
  const scrollY = Number.isFinite(scrollState?.scrollY) ? scrollState.scrollY : 0;
  const articleElement = findArticleElement(scrollState?.articlePath);
  const articleViewportTop = scrollState?.articleViewportTop;

  if (articleElement && Number.isFinite(articleViewportTop)) {
    return Math.max(0, Math.round(getScrollY() + articleElement.getBoundingClientRect().top - articleViewportTop));
  }

  return Math.max(0, Math.round(scrollY));
}

export function useAiInsightsScrollRestoration({ enabled = true, restoreSignature = '' } = {}) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const restoredKeyRef = useRef('');

  const saveScrollState = useCallback((article, event) => {
    if (!canUseDOM() || location.pathname !== AI_INSIGHTS_PATH || !isPrimaryNavigationEvent(event)) {
      return;
    }

    const target = event?.currentTarget;
    const targetRect = target?.getBoundingClientRect?.();
    const articlePath = article?.path || target?.getAttribute?.('data-ai-insights-article-path') || '';

    writeHistoryScrollState({
      pathname: location.pathname,
      search: location.search,
      scrollY: getScrollY(),
      articlePath,
      articleViewportTop: Number.isFinite(targetRect?.top) ? targetRect.top : null,
      savedAt: Date.now()
    });
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!enabled || !canUseDOM() || navigationType !== 'POP' || location.pathname !== AI_INSIGHTS_PATH) {
      return undefined;
    }

    const scrollState = getHistoryScrollState();
    if (!isValidScrollState(scrollState, location)) {
      return undefined;
    }

    const restoreKey = [
      location.key,
      scrollState.savedAt,
      scrollState.scrollY,
      scrollState.articlePath,
      restoreSignature
    ].join(':');

    if (restoredKeyRef.current === restoreKey) {
      return undefined;
    }

    let firstFrame = 0;
    let secondFrame = 0;
    let timeoutId = 0;
    let cancelled = false;

    const restore = () => {
      if (cancelled || restoredKeyRef.current === restoreKey) {
        return;
      }

      window.scrollTo({
        top: getAiInsightsRestoreTarget(scrollState),
        behavior: 'auto'
      });
      restoredKeyRef.current = restoreKey;
    };

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(restore);
    });
    timeoutId = window.setTimeout(restore, 160);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(timeoutId);
    };
  }, [
    enabled,
    location,
    navigationType,
    restoreSignature
  ]);

  return saveScrollState;
}
