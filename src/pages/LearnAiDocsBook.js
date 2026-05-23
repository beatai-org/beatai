import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import DocContent from '../components/docs/DocContent';
import DocsLayout from '../components/docs/DocsLayout';
import PageTransitionLoader from '../components/PageTransitionLoader';
import { NotFoundState } from '../components/learnClaudeCode/NotFoundState';
import { TagProvider } from '../contexts/TagContext';
import { useDocsMeta } from '../hooks/useDocsMeta';
import { collectDocPaths, normalizeMetaPath } from '../utils/docsMeta';
import { getLearnAiDefaultPath } from '../utils/learnAiPaths';
import { getLearnAiSpace } from '../utils/learnAiSpaces';
import { buildSiteTitle } from '../utils/siteConfig';
import { PAGE_CONFIG, PAGE_IDS } from '../utils/pageConfig';

function LearnAiDocsBook() {
  const { space: spaceSlug } = useParams();
  const location = useLocation();
  const currentSpace = getLearnAiSpace(spaceSlug);
  const {
    meta: rootMeta,
    loading: rootLoading,
    error: rootError
  } = useDocsMeta();
  const {
    meta: spaceMeta,
    loading: spaceLoading,
    error: spaceError
  } = useDocsMeta(null, currentSpace?.docsMetaFile || null);

  const tutorialMeta = useMemo(() => {
    if (!spaceMeta || !currentSpace) {
      return null;
    }

    return {
      categories: [{
        ...spaceMeta,
        id: currentSpace.docsCategoryId || currentSpace.slug,
        title: currentSpace.bookTitle || spaceMeta.title,
        githubRepo: currentSpace.githubRepo || spaceMeta.githubRepo,
        repoTitle: currentSpace.repoTitle || spaceMeta.repoTitle,
        bookPath: {
          parentTitle: PAGE_CONFIG[PAGE_IDS.aiTutorials].title,
          currentTitle: currentSpace.bookTitle || spaceMeta.title
        }
      }]
    };
  }, [currentSpace, spaceMeta]);

  const validPaths = useMemo(() => collectDocPaths(tutorialMeta), [tutorialMeta]);
  const normalizedPathname = normalizeMetaPath(location.pathname);
  const isBasePath = normalizedPathname === `/learn-ai/${spaceSlug}`;

  if (!currentSpace || currentSpace.contentSource !== 'docs') {
    return <NotFoundState label={spaceSlug || location.pathname} />;
  }

  if (rootLoading || spaceLoading) {
    return <PageTransitionLoader />;
  }

  if (rootError || spaceError || !rootMeta || !tutorialMeta) {
    return <div className="docs-loading">Failed to load documentation.</div>;
  }

  if (!isBasePath && !validPaths.has(normalizedPathname)) {
    return <NotFoundState label={normalizedPathname} />;
  }

  return (
    <>
      <Helmet>
        <title>{buildSiteTitle(currentSpace.bookTitle)}</title>
        <meta name="description" content={spaceMeta?.description || currentSpace.description} />
      </Helmet>

      <TagProvider meta={tutorialMeta}>
        <DocsLayout meta={tutorialMeta} shellMeta={rootMeta}>
          <Routes>
            <Route index element={<Navigate to={getLearnAiDefaultPath(currentSpace.slug)} replace />} />
            <Route path="*" element={<DocContent />} />
          </Routes>
        </DocsLayout>
      </TagProvider>
    </>
  );
}

export default LearnAiDocsBook;
