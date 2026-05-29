import React from 'react';
import Sidebar from './Sidebar';
import PageShell from '../layout/PageShell';
import BookFloatingActions from './BookFloatingActions';
import { cn } from '../../utils/classNames';

function BookWorkspaceLayout({
  rootClassName = '',
  sidebarMeta = null,
  sidebarOpen = false,
  onMenuToggle = null,
  onSidebarClose = null,
  containerClassName = '',
  mainClassName = '',
  afterMain = null,
  children
}) {
  return (
    <PageShell rootClassName={rootClassName} hideHeader>
      <BookFloatingActions
        sidebarOpen={sidebarOpen}
        onMenuToggle={onMenuToggle}
      />

      <div className={cn('docs-container', containerClassName)}>
        {sidebarMeta && (
          <Sidebar
            meta={sidebarMeta}
            isOpen={sidebarOpen}
            onClose={onSidebarClose}
          />
        )}

        <main className={cn('docs-main', mainClassName)}>
          {children}
        </main>
      </div>

      {afterMain}
    </PageShell>
  );
}

export default BookWorkspaceLayout;
