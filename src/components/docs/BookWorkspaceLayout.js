import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './DocsLayout.css';
import '../../styles/Background.css';
import '../../styles/3d-effects.css';
import '../../styles/animations.css';
import Sidebar from './Sidebar';
import ReadingModeDirectoryButton from './ReadingModeDirectoryButton';
import PageShell from '../layout/PageShell';
import { cn } from '../../utils/classNames';
import { ReadingModeProvider } from '../../contexts/ReadingModeContext';

const READING_MODE_PARAM = 'mode';
const READING_MODE_VALUE = 'read';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const isReadingMode = searchParams.get(READING_MODE_PARAM) === READING_MODE_VALUE;
  const [isReadingModeDirectoryOpen, setIsReadingModeDirectoryOpen] = useState(false);

  const setIsReadingMode = useCallback((next) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      const currentValue = params.get(READING_MODE_PARAM) === READING_MODE_VALUE;
      const resolved = typeof next === 'function' ? next(currentValue) : next;
      if (resolved) {
        params.set(READING_MODE_PARAM, READING_MODE_VALUE);
      } else {
        params.delete(READING_MODE_PARAM);
      }
      return params;
    }, { replace: false });
  }, [setSearchParams]);

  const toggleReadingMode = useCallback(() => {
    setIsReadingMode((current) => {
      if (current) {
        setIsReadingModeDirectoryOpen(false);
      }
      return !current;
    });
  }, [setIsReadingMode]);

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
  }, [isReadingMode, isReadingModeDirectoryOpen, setIsReadingMode]);

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
  }), [isReadingMode, setIsReadingMode, toggleReadingMode]);

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
