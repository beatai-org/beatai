import React, { useMemo } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router-dom';
import BookWorkspaceLayout from '../components/docs/BookWorkspaceLayout';
import PageSeo from '../components/seo/PageSeo';
import { LearnRouteNotFound } from '../components/learnClaudeCode/NotFoundState';
import VersionPage from '../components/learnClaudeCode/VersionPage';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useSidebarState } from '../hooks/useSidebarState';
import { useDocsMeta } from '../hooks/useDocsMeta';
import './LearnClaudeCode.css';
import { buildLccSidebarMeta } from '../components/learnClaudeCode/sidebarMeta';
import { buildKnowledgeNavigationModel } from '../domain/docs';
import {
  getBookBasePath,
  getBookDefaultUrl,
  getCollectionOfBook
} from '../content';

function LearnClaudeCode({ book }) {
  const { meta } = useDocsMeta();
  const location = useLocation();
  const handleCategoryClick = useCategoryNavigation();
  const { sidebarOpen, closeSidebar, toggleSidebar } = useSidebarState({
    closeOnChange: location.pathname
  });

  const { categories, spaces } = useMemo(() => buildKnowledgeNavigationModel(meta), [meta]);
  const collection = useMemo(() => getCollectionOfBook(book.id), [book.id]);
  const basePath = useMemo(() => getBookBasePath(book), [book]);
  const sidebarMeta = useMemo(() => buildLccSidebarMeta(book, collection), [book, collection]);
  const activeSpace = useMemo(() => collection ? {
    id: collection.id,
    title: collection.title,
    entryPath: collection.basePath,
    kind: 'tutorial-hub'
  } : null, [collection]);

  return (
    <>
      <PageSeo title={book.bookTitle} description={book.description} />

      <BookWorkspaceLayout
        rootClassName="lcc-page"
        spaces={spaces}
        activeSpace={activeSpace}
        onSpaceClick={handleCategoryClick}
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
        sidebarMeta={sidebarMeta}
        sidebarOpen={sidebarOpen}
        onMenuToggle={toggleSidebar}
        onSidebarClose={closeSidebar}
      >
        <Routes>
          <Route index element={<Navigate to={getBookDefaultUrl(book)} replace />} />
          <Route path=":version" element={<VersionPage book={book} basePath={basePath} />} />
          <Route path="*" element={<LearnRouteNotFound />} />
        </Routes>
      </BookWorkspaceLayout>
    </>
  );
}

export default LearnClaudeCode;
