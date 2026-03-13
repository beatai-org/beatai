import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import './styles/Background.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnnotationProvider } from './contexts/AnnotationContext';
import { TagProvider } from './contexts/TagContext';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Docs = lazy(() => import('./pages/Docs'));
const MyNotes = lazy(() => import('./components/docs/MyNotes'));
const TagPage = lazy(() => import('./pages/TagPage'));
const Square = lazy(() => import('./pages/Square'));
const LogoShowcase = lazy(() => import('./pages/LogoShowcase'));

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AnnotationProvider>
          <BrowserRouter>
            <div className="App dynamic-background">
              <Suspense fallback={<div className="loading">Loading...</div>}>
                <Routes>
                  {/* 根目录跳转到广场 */}
                  <Route path="/" element={<Navigate to="/square" replace />} />
                  <Route path="/genesis-lab" element={<Home />} />
                  <Route path="/my-notes" element={<MyNotes />} />
                  <Route path="/square" element={<Square />} />
                  <Route path="/logo-showcase" element={<LogoShowcase />} />
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
