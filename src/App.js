import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { HistoryProvider } from './contexts/HistoryContext';
import PageTransitionLoader from './components/PageTransitionLoader';
import { lazyWithMinLoadTime } from './utils/lazyWithMinLoadTime';
import {
  rewriteLegacyLearnClaudeCodePath
} from './utils/learnAiPaths';
import { APP_ROUTE_PATHS, PAGE_CONFIG, PAGE_IDS } from './utils/pageConfig';
import { HOME_PATH } from './utils/siteRoutes';

// Lazy load components with minimum load time (500ms)
const Home = lazy(() => lazyWithMinLoadTime(() => import('./pages/Home')));
const Docs = lazy(() => lazyWithMinLoadTime(() => import('./pages/Docs')));
const TagPage = lazy(() => lazyWithMinLoadTime(() => import('./pages/TagPage')));
const Square = lazy(() => lazyWithMinLoadTime(() => import('./pages/Square')));
const LogoShowcase = lazy(() => lazyWithMinLoadTime(() => import('./pages/LogoShowcase')));
const LearnAiBook = lazy(() => lazyWithMinLoadTime(() => import('./pages/LearnAiBook')));
const AITutorials = lazy(() => lazyWithMinLoadTime(() => import('./pages/AITutorials')));
const AIContinentDemo = lazy(() => lazyWithMinLoadTime(() => import('./pages/AIContinentDemo')));
const MapTextureShowcase = lazy(() => lazyWithMinLoadTime(() => import('./pages/MapTextureShowcase')));
const AiInsightsArchive = lazy(() => lazyWithMinLoadTime(() => import('./pages/AiInsightsArchive')));

function LegacyLearnClaudeCodeRedirect() {
  const location = useLocation();
  const nextPath = rewriteLegacyLearnClaudeCodePath(location.pathname);

  return <Navigate to={`${nextPath}${location.search}${location.hash}`} replace />;
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <HistoryProvider>
            <BrowserRouter>
              <div className="App dynamic-background">
                <Suspense fallback={<PageTransitionLoader />}>
                  <Routes>
                    {/* 根目录跳转到 ai-insights 档案页 */}
                    <Route path={APP_ROUTE_PATHS.root} element={<Navigate to={HOME_PATH} replace />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.genesisLab].path} element={<Home />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.square].path} element={<Square />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.aiContinentDemo].path} element={<AIContinentDemo />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.mapTextureShowcase].path} element={<MapTextureShowcase />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.logoShowcase].path} element={<LogoShowcase />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.aiTutorials].path} element={<AITutorials />} />
                    <Route path={APP_ROUTE_PATHS.legacyLearnClaudeCode} element={<LegacyLearnClaudeCodeRedirect />} />
                    <Route path={APP_ROUTE_PATHS.learnAiBook} element={<LearnAiBook />} />
                    <Route path={APP_ROUTE_PATHS.tags} element={<TagPage />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.aiInsights].path} element={<AiInsightsArchive />} />
                    <Route path={APP_ROUTE_PATHS.catchAll} element={<Docs />} />
                  </Routes>
                </Suspense>
              </div>
            </BrowserRouter>
          </HistoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
