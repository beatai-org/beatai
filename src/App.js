import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import './styles/Background.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnnotationProvider } from './contexts/AnnotationContext';
import PageTransitionLoader from './components/PageTransitionLoader';
import { lazyWithMinLoadTime } from './utils/lazyWithMinLoadTime';
import {
  LEARN_AI_BASE_PATH,
  rewriteLegacyLearnClaudeCodePath
} from './utils/learnAiPaths';
import { AI_TUTORIALS_PATH } from './utils/knowledgeSpaces';

// Lazy load components with minimum load time (500ms)
const Home = lazy(() => lazyWithMinLoadTime(() => import('./pages/Home')));
const Docs = lazy(() => lazyWithMinLoadTime(() => import('./pages/Docs')));
const MyNotes = lazy(() => lazyWithMinLoadTime(() => import('./components/docs/MyNotes')));
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
        <AnnotationProvider>
          <BrowserRouter>
            <div className="App dynamic-background">
              <Suspense fallback={<PageTransitionLoader />}>
                <Routes>
                  {/* 根目录跳转到 ai-insights 档案页 */}
                  <Route path="/" element={<Navigate to="/ai-insights" replace />} />
                  <Route path="/genesis-lab" element={<Home />} />
                  <Route path="/my-notes" element={<MyNotes />} />
                  <Route path="/square" element={<Square />} />
                  <Route path="/ai-continent-demo" element={<AIContinentDemo />} />
                  <Route path="/map-texture-showcase" element={<MapTextureShowcase />} />
                  <Route path="/logo-showcase" element={<LogoShowcase />} />
                  <Route path={AI_TUTORIALS_PATH} element={<AITutorials />} />
                  <Route path="/learn-claude-code/*" element={<LegacyLearnClaudeCodeRedirect />} />
                  <Route path={`${LEARN_AI_BASE_PATH}/:space/*`} element={<LearnAiBook />} />
                  <Route path="/tags/:tagName" element={<TagPage />} />
                  <Route path="/ai-insights" element={<AiInsightsArchive />} />
                  <Route path="/*" element={<Docs />} />
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
        </AnnotationProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
