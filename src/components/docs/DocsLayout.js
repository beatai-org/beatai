import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import BookWorkspaceLayout from './BookWorkspaceLayout';
import { PageTitleProvider } from '../../contexts/PageTitleContext';
import { MetaProvider } from '../../contexts/MetaContext';
import { useCategoryNavigation } from '../../hooks/useCategoryNavigation';
import { useSidebarState } from '../../hooks/useSidebarState';
import { findActiveCategoryByPath } from '../../utils/docsMetaSelectors';
import { buildKnowledgeSpaces, findActiveKnowledgeSpace } from '../../utils/knowledgeSpaces';

// Inner component that uses the context
const DocsLayoutInner = ({ meta, shellMeta = null, children }) => {
  const location = useLocation();
  const handleCategoryClick = useCategoryNavigation();
  const { sidebarOpen, closeSidebar, toggleSidebar } = useSidebarState();
  const navMeta = shellMeta || meta;

  // Extract categories from meta with useMemo to prevent recreation
  const categories = useMemo(() => navMeta?.categories || [], [navMeta]);
  const spaces = useMemo(() => buildKnowledgeSpaces(navMeta), [navMeta]);

  const activeCategory = useMemo(() => {
    return findActiveCategoryByPath(navMeta, location.pathname);
  }, [navMeta, location.pathname]);

  const activeSpace = useMemo(() => {
    return findActiveKnowledgeSpace(navMeta, location.pathname);
  }, [navMeta, location.pathname]);

  const sidebarCategory = useMemo(() => {
    return findActiveCategoryByPath(meta, location.pathname);
  }, [meta, location.pathname]);

  // Prepare meta object for Sidebar (using only active category's sections)
  const sidebarMeta = sidebarCategory ? {
    title: sidebarCategory.title,
    sections: sidebarCategory.sections,
    githubRepo: sidebarCategory.githubRepo,
    repoTitle: sidebarCategory.repoTitle,
    bookPath: sidebarCategory.bookPath || null
  } : null;

  return (
    <BookWorkspaceLayout
      rootClassName="docs-layout"
      spaces={spaces}
      activeSpace={activeSpace}
      onSpaceClick={handleCategoryClick}
      categories={categories}
      activeCategory={activeCategory}
      onCategoryClick={handleCategoryClick}
      sidebarMeta={sidebarMeta}
      sidebarOpen={sidebarOpen}
      onMenuToggle={toggleSidebar}
      onSidebarClose={closeSidebar}
    >
      {children}
    </BookWorkspaceLayout>
  );
};

// Main component with providers
const DocsLayout = ({ meta, shellMeta = null, children }) => {
  return (
    <PageTitleProvider meta={meta}>
      <MetaProvider meta={meta}>
        <DocsLayoutInner meta={meta} shellMeta={shellMeta}>
          {children}
        </DocsLayoutInner>
      </MetaProvider>
    </PageTitleProvider>
  );
};

export default DocsLayout;
