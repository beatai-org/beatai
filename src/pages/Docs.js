import React, { useMemo } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import DocsLayout from '../components/docs/DocsLayout';
import DocContent from '../components/docs/DocContent';
import PageTransitionLoader from '../components/PageTransitionLoader';
import PageSeo from '../components/seo/PageSeo';
import { TagProvider } from '../contexts/TagContext';
import { useDocsMeta } from '../hooks/useDocsMeta';
import {
  collectDocPaths,
  findCategoryById,
  getDefaultDocsPath,
  getFirstNavigablePathForCategory
} from '../utils/docsMetaSelectors';
import { PAGE_IDS } from '../utils/pageConfig';
import NotFound from './NotFound';
import './Docs.css';

// Component to handle category-level redirects
const CategoryRedirect = ({ meta }) => {
  const { categoryId } = useParams();
  const category = findCategoryById(meta, categoryId);
  const redirectPath = getFirstNavigablePathForCategory(category) || '/';
  return <Navigate to={redirectPath} replace />;
};

const Docs = () => {
  const { meta: docsMeta, loading, error } = useDocsMeta();
  const location = useLocation();

  const validPaths = useMemo(() => {
    return collectDocPaths(docsMeta);
  }, [docsMeta]);

  if (error) {
    return <div className="docs-loading">Failed to load documentation.</div>;
  }

  if (loading || !docsMeta) {
    return <PageTransitionLoader />;
  }

  const isValidDocsPath = validPaths.has(location.pathname);

  if (location.pathname !== '/' && !isValidDocsPath) {
    return <NotFound requestedPath={location.pathname} />;
  }

  const defaultPath = getDefaultDocsPath(docsMeta);

  return (
    <>
      <PageSeo pageId={PAGE_IDS.docs} />

      <TagProvider meta={docsMeta}>
        <DocsLayout meta={docsMeta}>
          <Routes>
            <Route index element={<Navigate to={defaultPath} replace />} />
            <Route path=":categoryId" element={<CategoryRedirect meta={docsMeta} />} />
            <Route path="*" element={<DocContent />} />
          </Routes>
        </DocsLayout>
      </TagProvider>
    </>
  );
};

export default Docs;
