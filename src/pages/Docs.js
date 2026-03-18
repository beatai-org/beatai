import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DocsLayout from '../components/docs/DocsLayout';
import DocContent from '../components/docs/DocContent';
import { TagProvider } from '../contexts/TagContext';
import NotFound from './NotFound';
import './Docs.css';

// Component to handle category-level redirects
const CategoryRedirect = ({ meta }) => {
  const { categoryId } = useParams();

  const getFirstChapterPath = (categoryId) => {
    const category = meta?.categories?.find(cat => cat.id === categoryId);
    if (!category) return '/';

    const firstSection = category.sections?.[0];
    if (!firstSection) return '/';

    // If section has items, return the first item's path
    if (firstSection.items && firstSection.items.length > 0) {
      return firstSection.items[0].path;
    }

    // Otherwise return the section's own path
    return firstSection.path;
  };

  const redirectPath = getFirstChapterPath(categoryId);
  return <Navigate to={redirectPath} replace />;
};

const Docs = () => {
  const [docsMeta, setDocsMeta] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Load docs metadata
    // Use process.env.PUBLIC_URL to handle both dev and production environments
    const metaPath = `${process.env.PUBLIC_URL}/docs/_meta.json`;
    fetch(metaPath)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Sort ai-insights sections in reverse chronological order (newest first)
        if (data?.categories) {
          data.categories.forEach(cat => {
            if (cat.id === 'ai-insights' && cat.sections) {
              cat.sections.reverse();
            }
          });
        }
        setDocsMeta(data);
      })
      .catch(err => console.error('Failed to load docs meta:', err));
  }, []);

  const validPaths = useMemo(() => {
    const paths = new Set();

    const collectItems = (items = []) => {
      items.forEach((item) => {
        if (item.path) {
          paths.add(item.path);
        }
        if (item.children?.length) {
          collectItems(item.children);
        }
      });
    };

    docsMeta?.categories?.forEach((category) => {
      paths.add(`/${category.id}`);
      category.sections?.forEach((section) => {
        if (section.path) {
          paths.add(section.path);
        }
        collectItems(section.items || []);
      });
    });

    return paths;
  }, [docsMeta]);

  if (!docsMeta) {
    return <div className="docs-loading">Loading documentation...</div>;
  }

  const isValidDocsPath = validPaths.has(location.pathname);

  if (location.pathname !== '/' && !isValidDocsPath) {
    return <NotFound requestedPath={location.pathname} />;
  }

  // Get default path - dynamically get the first chapter of the first book
  const getDefaultPath = () => {
    const firstCategory = docsMeta?.categories?.[0];
    if (!firstCategory) return '/';

    const firstSection = firstCategory.sections?.[0];
    if (!firstSection) return '/';

    // If section has items, return the first item's path
    if (firstSection.items && firstSection.items.length > 0) {
      return firstSection.items[0].path;
    }

    // Otherwise return the section's own path
    return firstSection.path;
  };

  const defaultPath = getDefaultPath();

  return (
    <>
      <Helmet>
        <title>Documentation | BeatAI</title>
        <meta name="description" content="Complete documentation for BeatAI - the open-source AI bot framework" />
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
