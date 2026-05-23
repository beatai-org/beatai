import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import BookWorkspaceLayout from './BookWorkspaceLayout';
import { PageTitleProvider } from '../../contexts/PageTitleContext';
import { MetaProvider } from '../../contexts/MetaContext';
import { useCategoryNavigation } from '../../hooks/useCategoryNavigation';
import { useSidebarState } from '../../hooks/useSidebarState';
import { buildDocsWorkspaceModel } from '../../domain/docs';

// Inner component that uses the context
const DocsLayoutInner = ({ meta, shellMeta = null, children }) => {
  const location = useLocation();
  const handleCategoryClick = useCategoryNavigation();
  const { sidebarOpen, closeSidebar, toggleSidebar } = useSidebarState();
  const {
    activeCategory,
    activeSpace,
    categories,
    sidebarMeta,
    spaces
  } = useMemo(() => {
    return buildDocsWorkspaceModel({
      meta,
      shellMeta,
      pathname: location.pathname
    });
  }, [location.pathname, meta, shellMeta]);

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
