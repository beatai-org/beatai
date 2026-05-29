import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { HistoryProvider } from './contexts/HistoryContext';
import PageTransitionLoader from './components/PageTransitionLoader';
import { lazyWithMinLoadTime } from './utils/lazyWithMinLoadTime';
import { ROUTE_MODULE_LOADERS } from './utils/routeModuleLoaders';
import { APP_ROUTE_PATHS, PAGE_CONFIG, PAGE_IDS } from './utils/pageConfig';
import {
  BOOKS,
  COLLECTIONS,
  getBookBasePath,
  getBookDefaultUrl
} from './content';
import { HOME_PATH } from './utils/siteRoutes';

// Lazy-load route components; avoid adding artificial delay to navigation.
const Home = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.genesisLab]));
const TagPage = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.tag]));
const Square = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.square]));
const LogoShowcase = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.logoShowcase]));
const BookPage = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.bookPage]));
const CollectionPage = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.collectionPage]));
const NotFound = lazy(() => lazyWithMinLoadTime(ROUTE_MODULE_LOADERS[PAGE_IDS.notFound]));

const ROUTER_FUTURE_FLAGS = Object.freeze({
  v7_startTransition: true,
  v7_relativeSplatPath: true
});

const LCC_BOOK_ID = 'learn-claude-code';

// Rewrite legacy /learn-claude-code/<version> URLs to the unified LCC URL.
function LegacyLearnClaudeCodeRedirect() {
  const location = useLocation();
  const version = location.pathname.replace(/^\/learn-claude-code\/?/, '').split('/')[0];
  const target = version
    ? `${getBookBasePath(LCC_BOOK_ID)}/${version}`
    : getBookDefaultUrl(LCC_BOOK_ID);
  return <Navigate to={`${target}${location.search}${location.hash}`} replace />;
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <HistoryProvider>
            <BrowserRouter future={ROUTER_FUTURE_FLAGS}>
              <div className="App dynamic-background">
                <Suspense fallback={<PageTransitionLoader />}>
                  <Routes>
                    {/* 根目录跳转到 ai-insights 档案页 */}
                    <Route path={APP_ROUTE_PATHS.root} element={<Navigate to={HOME_PATH} replace />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.genesisLab].path} element={<Home />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.square].path} element={<Square />} />
                    <Route path={PAGE_CONFIG[PAGE_IDS.logoShowcase].path} element={<LogoShowcase />} />
                    <Route path={APP_ROUTE_PATHS.legacyLearnClaudeCode} element={<LegacyLearnClaudeCodeRedirect />} />
                    {/* /ai-insights is handled by the BOOK route below (the
                        ai-insights book matches /ai-insights/*); its
                        MarkdownBookContent auto-redirects the bare URL to the
                        first sidebar article. Keeping the redirect inside the
                        BookPage subtree avoids a second loader flash from a
                        route-level handoff. */}
                    {/* Collection hub pages — one route per collection */}
                    {COLLECTIONS.map((collection) => (
                      <Route key={`collection:${collection.id}`}
                             path={collection.basePath}
                             element={<CollectionPage collection={collection} />} />
                    ))}
                    {/* Book pages — one route per book, URL derived from collection membership */}
                    {BOOKS.map((book) => (
                      <Route key={`book:${book.id}`}
                             path={`${getBookBasePath(book)}/*`}
                             element={<BookPage book={book} />} />
                    ))}
                    <Route path={APP_ROUTE_PATHS.tags} element={<TagPage />} />
                    <Route path={APP_ROUTE_PATHS.catchAll} element={<NotFound />} />
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
