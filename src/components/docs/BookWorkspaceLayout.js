import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './DocsLayout.css';
import '../../styles/Background.css';
import '../../styles/3d-effects.css';
import '../../styles/animations.css';
import Sidebar from './Sidebar';
import ReadingModeDirectoryButton from './ReadingModeDirectoryButton';
import PageShell from '../layout/PageShell';
import { cn } from '../../utils/classNames';
import { ReadingModeProvider } from '../../contexts/ReadingModeContext';

function BookWorkspaceLayout({
  rootClassName = '',
  spaces = null,
  activeSpace = null,
  onSpaceClick = null,
  categories = [],
  activeCategory = null,
  onCategoryClick = null,
  sidebarMeta = null,
  sidebarOpen = false,
  onMenuToggle = null,
  onSidebarClose = null,
  containerClassName = '',
  mainClassName = '',
  showFooter = true,
  afterMain = null,
  children
}) {
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isReadingModeDirectoryOpen, setIsReadingModeDirectoryOpen] = useState(false);

  const toggleReadingMode = useCallback(() => {
    setIsReadingMode((current) => {
      if (current) {
        setIsReadingModeDirectoryOpen(false);
      }
      return !current;
    });
  }, []);

  useEffect(() => {
    if (!isReadingMode) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isReadingModeDirectoryOpen) {
          setIsReadingModeDirectoryOpen(false);
          return;
        }
        setIsReadingMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReadingMode, isReadingModeDirectoryOpen]);

  useEffect(() => {
    if (isReadingMode && sidebarOpen && onSidebarClose) {
      onSidebarClose();
    }
  }, [isReadingMode, onSidebarClose, sidebarOpen]);

  useEffect(() => {
    if (!isReadingMode) {
      setIsReadingModeDirectoryOpen(false);
    }
  }, [isReadingMode]);

  const readingModeValue = useMemo(() => ({
    isReadingMode,
    setReadingMode: setIsReadingMode,
    toggleReadingMode
  }), [isReadingMode, toggleReadingMode]);

  return (
    <ReadingModeProvider value={readingModeValue}>
      <PageShell
        rootClassName={cn(rootClassName, isReadingMode && 'reading-mode')}
        spaces={spaces}
        activeSpace={activeSpace}
        onSpaceClick={onSpaceClick}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={onCategoryClick}
        sidebarOpen={sidebarOpen}
        onMenuToggle={onMenuToggle}
        showFooter={showFooter}
        hideHeader={isReadingMode}
        showReadingModeToggle
      >
        {isReadingMode && sidebarMeta ? (
          <>
            <ReadingModeDirectoryButton onClick={() => setIsReadingModeDirectoryOpen(true)} />
            <Sidebar
              meta={sidebarMeta}
              isOpen={isReadingModeDirectoryOpen}
              onClose={() => setIsReadingModeDirectoryOpen(false)}
              className="reading-mode-overlay"
              overlayClassName="reading-mode-overlay"
            />
          </>
        ) : null}

        <div className={cn('docs-container', isReadingMode && 'reading-mode', containerClassName)}>
          {sidebarMeta && !isReadingMode && (
            <Sidebar
              meta={sidebarMeta}
              isOpen={sidebarOpen}
              onClose={onSidebarClose}
            />
          )}

          <main className={cn('docs-main', isReadingMode && 'reading-mode', mainClassName)}>
            {children}
          </main>
        </div>

        {afterMain}
      </PageShell>
    </ReadingModeProvider>
  );
}

export default BookWorkspaceLayout;
