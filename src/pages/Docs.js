import React, { useMemo } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DocsLayout from '../components/docs/DocsLayout';
import DocContent from '../components/docs/DocContent';
import PageTransitionLoader from '../components/PageTransitionLoader';
import { TagProvider } from '../contexts/TagContext';
import { useDocsMeta } from '../hooks/useDocsMeta';
import {
  collectDocPaths,
  getDefaultDocsPath,
  getFirstNavigablePathForCategory
} from '../utils/docsMeta';
import {
  buildSiteTitle,
  SITE_CONFIG
} from '../utils/siteConfig';
import NotFound from './NotFound';
import './Docs.css';

// Component to handle category-level redirects
const CategoryRedirect = ({ meta }) => {
  const { categoryId } = useParams();
  const category = meta?.categories?.find((item) => item.id === categoryId);
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
      <Helmet>
        <title>{buildSiteTitle(SITE_CONFIG.seo.docsPageTitle)}</title>
        <meta name="description" content={SITE_CONFIG.seo.docsDescription} />
      </Helmet>

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
