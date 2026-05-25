import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import BookWorkspaceLayout from './BookWorkspaceLayout';
import { PageTitleProvider } from '../../contexts/PageTitleContext';
import { MetaProvider } from '../../contexts/MetaContext';
import { useSidebarState } from '../../hooks/useSidebarState';
import { buildDocsWorkspaceModel } from '../../domain/docs';

// Inner component that uses the context
const DocsLayoutInner = ({ meta, children }) => {
  const location = useLocation();
  const { sidebarOpen, closeSidebar, toggleSidebar } = useSidebarState();
  const { sidebarMeta } = useMemo(() => {
    return buildDocsWorkspaceModel({ meta, pathname: location.pathname });
  }, [location.pathname, meta]);

  return (
    <BookWorkspaceLayout
      rootClassName="docs-layout"
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
const DocsLayout = ({ meta, children }) => {
  return (
    <PageTitleProvider meta={meta}>
      <MetaProvider meta={meta}>
        <DocsLayoutInner meta={meta}>
          {children}
        </DocsLayoutInner>
      </MetaProvider>
    </PageTitleProvider>
  );
};

export default DocsLayout;
