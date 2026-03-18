import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import './styles/Background.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnnotationProvider } from './contexts/AnnotationContext';
import PageTransitionLoader from './components/PageTransitionLoader';
import { lazyWithMinLoadTime } from './utils/lazyWithMinLoadTime';

// Lazy load components with minimum load time (500ms)
const Home = lazy(() => lazyWithMinLoadTime(() => import('./pages/Home')));
const Docs = lazy(() => lazyWithMinLoadTime(() => import('./pages/Docs')));
const MyNotes = lazy(() => lazyWithMinLoadTime(() => import('./components/docs/MyNotes')));
const TagPage = lazy(() => lazyWithMinLoadTime(() => import('./pages/TagPage')));
const Square = lazy(() => lazyWithMinLoadTime(() => import('./pages/Square')));
const LogoShowcase = lazy(() => lazyWithMinLoadTime(() => import('./pages/LogoShowcase')));
const LearnClaudeCode = lazy(() => lazyWithMinLoadTime(() => import('./pages/LearnClaudeCode')));

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AnnotationProvider>
          <BrowserRouter>
            <div className="App dynamic-background">
              <Suspense fallback={<PageTransitionLoader />}>
                <Routes>
                  {/* 根目录跳转到广场 */}
                  <Route path="/" element={<Navigate to="/square" replace />} />
                  <Route path="/genesis-lab" element={<Home />} />
                  <Route path="/my-notes" element={<MyNotes />} />
                  <Route path="/square" element={<Square />} />
                  <Route path="/logo-showcase" element={<LogoShowcase />} />
                  <Route path="/learn-claude-code/*" element={<LearnClaudeCode />} />
                  <Route path="/tags/:tagName" element={<TagPage />} />
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
