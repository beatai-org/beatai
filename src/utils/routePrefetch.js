import { PAGE_CONFIG, PAGE_IDS } from './pageConfig';
import { AI_INSIGHTS_PATH, HOME_PATH } from './siteRoutes';
import { ROUTE_MODULE_LOADERS } from './routeModuleLoaders';
import {
  getBookByPathname,
  getCollectionByPathname
} from '../content';

const LEGACY_LEARN_CLAUDE_CODE_BASE_PATH = '/learn-claude-code';

const routeModulePreloadCache = new Map();

function getPathname(target) {
  const value = typeof target === 'string' ? target : target?.pathname;
  if (!value) {
    return '';
  }

  if (/^https?:\/\//i.test(value)) {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

    try {
      const url = new URL(value);
      return url.origin === currentOrigin ? url.pathname : '';
    } catch (error) {
      return '';
    }
  }

  const [pathWithoutSearch] = value.split(/[?#]/);
  return pathWithoutSearch.startsWith('/') ? pathWithoutSearch : `/${pathWithoutSearch}`;
}

export function getRouteIdForPath(target) {
  const pathname = getPathname(target);
  if (!pathname || pathname === '#') {
    return null;
  }

  if (pathname === '/' || pathname === HOME_PATH || pathname === AI_INSIGHTS_PATH) {
    return PAGE_IDS.aiInsights;
  }

  if (pathname === PAGE_CONFIG[PAGE_IDS.genesisLab].path) {
    return PAGE_IDS.genesisLab;
  }

  if (pathname === PAGE_CONFIG[PAGE_IDS.square].path) {
    return PAGE_IDS.square;
  }

  if (pathname === PAGE_CONFIG[PAGE_IDS.logoShowcase].path) {
    return PAGE_IDS.logoShowcase;
  }

  if (pathname === PAGE_CONFIG[PAGE_IDS.aiContinentDemo].path) {
    return PAGE_IDS.aiContinentDemo;
  }

  if (pathname === PAGE_CONFIG[PAGE_IDS.mapTextureShowcase].path) {
    return PAGE_IDS.mapTextureShowcase;
  }

  if (pathname.startsWith('/tags/')) {
    return PAGE_IDS.tag;
  }

  if (getCollectionByPathname(pathname)) {
    return PAGE_IDS.collectionPage;
  }

  if (getBookByPathname(pathname) || pathname.startsWith(`${LEGACY_LEARN_CLAUDE_CODE_BASE_PATH}/`)) {
    return PAGE_IDS.bookPage;
  }

  return pathname.startsWith('/') ? PAGE_IDS.notFound : null;
}

export function preloadRouteModule(routeId) {
  const loader = ROUTE_MODULE_LOADERS[routeId];
  if (!loader) {
    return Promise.resolve(undefined);
  }

  const cached = routeModulePreloadCache.get(routeId);
  if (cached) {
    return cached;
  }

  const request = Promise.resolve()
    .then(loader)
    .catch(() => {
      routeModulePreloadCache.delete(routeId);
      return undefined;
    });

  routeModulePreloadCache.set(routeId, request);
  return request;
}

export function preloadRouteForPath(target) {
  return preloadRouteModule(getRouteIdForPath(target));
}

export function clearRoutePreloadCache() {
  routeModulePreloadCache.clear();
}
