import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import './styles/Background.css';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Docs = lazy(() => import('./pages/Docs'));

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="App dynamic-background">
            <Suspense fallback={<div className="loading">Loading...</div>}>
              <Routes>
                <Route path="/genesis-lab" element={<Home />} />
                <Route path="/*" element={<Docs />} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
