import { PAGE_IDS } from './pageConfig';

export const ROUTE_MODULE_LOADERS = Object.freeze({
  [PAGE_IDS.genesisLab]: () => import('../pages/Home'),
  [PAGE_IDS.notFound]: () => import('../pages/NotFound'),
  [PAGE_IDS.tag]: () => import('../pages/TagPage'),
  [PAGE_IDS.square]: () => import('../pages/Square'),
  [PAGE_IDS.logoShowcase]: () => import('../pages/LogoShowcase'),
  [PAGE_IDS.bookPage]: () => import('../pages/BookPage'),
  [PAGE_IDS.collectionPage]: () => import('../pages/CollectionPage'),
  [PAGE_IDS.aiContinentDemo]: () => import('../pages/AIContinentDemo'),
  [PAGE_IDS.mapTextureShowcase]: () => import('../pages/MapTextureShowcase'),
  [PAGE_IDS.aiInsights]: () => import('../pages/AiInsightsArchive')
});
