import React, { useMemo } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import DocContent from '../components/docs/DocContent';
import DocsLayout from '../components/docs/DocsLayout';
import PageTransitionLoader from '../components/PageTransitionLoader';
import PageSeo from '../components/seo/PageSeo';
import { NotFoundState } from '../components/docs/NotFoundState';
import { TagProvider } from '../contexts/TagContext';
import { useDocsMeta } from '../hooks/useDocsMeta';
import {
  buildBookCategoryMeta,
  buildBookRouteValidationModel,
  buildSidebarMeta
} from '../domain/docs';
import { getBookBasePath, getBookDefaultUrl, getCollectionOfBook } from '../content';

// One renderer for every Markdown book — whether it lives at the top level
// (e.g. /rust-course/...) or under a collection (e.g. /mba/elon-book/...).
// The book's URL and parent label both come from data in src/content/.
function MarkdownBookContent({ book }) {
  const location = useLocation();
  const collection = getCollectionOfBook(book.id);
  const basePath = getBookBasePath(book);

  const {
    meta: bookMetaRaw,
    loading: bookLoading,
    error: bookError
  } = useDocsMeta(null, book.metaFile || null);

  const docsMeta = useMemo(() => buildBookCategoryMeta({
    bookMeta: bookMetaRaw,
    book,
    parentTitle: collection?.title || ''
  }), [bookMetaRaw, book, collection]);

  const routeValidation = useMemo(() => buildBookRouteValidationModel(
    docsMeta,
    location.pathname,
    basePath
  ), [basePath, docsMeta, location.pathname]);

  // Where the bare /:book/ URL should redirect. Books with an explicit
  // `defaultEntry` use it; the rest (e.g. ai-insights, where the entries are
  // dynamic articles) fall through to the first sidebar item — same data the
  // actual sidebar will render, so the destination always matches what users
  // see highlighted.
  const indexTarget = useMemo(() => {
    if (book.defaultEntry) {
      return getBookDefaultUrl(book);
    }
    const category = docsMeta?.categories?.[0];
    if (!category) return basePath;
    const sidebarMeta = buildSidebarMeta(category);
    return sidebarMeta?.sections?.[0]?.items?.[0]?.path || basePath;
  }, [book, basePath, docsMeta]);

  if (bookLoading) {
    return <PageTransitionLoader />;
  }

  if (bookError || !docsMeta) {
    return <div className="docs-loading">Failed to load documentation.</div>;
  }

  if (!routeValidation.isValidPath) {
    return <NotFoundState label={routeValidation.normalizedPathname} />;
  }

  return (
    <>
      <PageSeo
        title={book.bookTitle}
        description={bookMetaRaw?.description || book.description}
      />

      <TagProvider meta={docsMeta}>
        <DocsLayout meta={docsMeta}>
          <Routes>
            <Route index element={<Navigate to={indexTarget} replace />} />
            <Route path="*" element={<DocContent book={book} />} />
          </Routes>
        </DocsLayout>
      </TagProvider>
    </>
  );
}

export default MarkdownBookContent;
