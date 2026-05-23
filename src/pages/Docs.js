import React, { useMemo } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import DocsLayout from '../components/docs/DocsLayout';
import DocContent from '../components/docs/DocContent';
import PageTransitionLoader from '../components/PageTransitionLoader';
import PageSeo from '../components/seo/PageSeo';
import { TagProvider } from '../contexts/TagContext';
import { useDocsMeta } from '../hooks/useDocsMeta';
import {
  buildDocsRouteValidationModel,
  findDocCategory,
  getCategoryEntryPath
} from '../domain/docs';
import { PAGE_IDS } from '../utils/pageConfig';
import NotFound from './NotFound';
import './Docs.css';

// Component to handle category-level redirects
const CategoryRedirect = ({ meta }) => {
  const { categoryId } = useParams();
  const category = findDocCategory(meta, categoryId);
  const redirectPath = getCategoryEntryPath(category, '/');
  return <Navigate to={redirectPath} replace />;
};

const Docs = () => {
  const { meta: docsMeta, loading, error } = useDocsMeta();
  const location = useLocation();

  const routeValidation = useMemo(() => {
    return buildDocsRouteValidationModel(docsMeta, location.pathname);
  }, [docsMeta, location.pathname]);

  if (error) {
    return <div className="docs-loading">Failed to load documentation.</div>;
  }

  if (loading || !docsMeta) {
    return <PageTransitionLoader />;
  }

  if (!routeValidation.isValidDocsPath) {
    return <NotFound requestedPath={location.pathname} />;
  }

  return (
    <>
      <PageSeo pageId={PAGE_IDS.docs} />

      <TagProvider meta={docsMeta}>
        <DocsLayout meta={docsMeta}>
          <Routes>
            <Route index element={<Navigate to={routeValidation.defaultPath} replace />} />
            <Route path=":categoryId" element={<CategoryRedirect meta={docsMeta} />} />
            <Route path="*" element={<DocContent />} />
          </Routes>
        </DocsLayout>
      </TagProvider>
    </>
  );
};

export default Docs;
