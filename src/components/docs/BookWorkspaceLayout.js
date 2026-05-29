import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from './Sidebar';
import PageShell from '../layout/PageShell';
import { cn } from '../../utils/classNames';
import { ReadingModeProvider } from '../../contexts/ReadingModeContext';
import { useReadingModeSearchParam } from '../../hooks/useReadingModeSearchParam';

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
  const {
    isReadingMode,
    isReadonlyMode,
    modeSearch,
    setReadingMode: setIsReadingMode,
    toggleReadingMode: toggleReadingModeParam
  } = useReadingModeSearchParam();
  const [isReadingModeDirectoryOpen, setIsReadingModeDirectoryOpen] = useState(false);

  const toggleReadingMode = useCallback(() => {
    if (isReadingMode) {
      setIsReadingModeDirectoryOpen(false);
    }

    toggleReadingModeParam();
  }, [isReadingMode, toggleReadingModeParam]);

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
        if (isReadonlyMode) return;
        setIsReadingMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReadingMode, isReadonlyMode, isReadingModeDirectoryOpen, setIsReadingMode]);

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
    isReadonlyMode,
    modeSearch,
    setReadingMode: setIsReadingMode,
    toggleReadingMode
  }), [isReadingMode, isReadonlyMode, modeSearch, setIsReadingMode, toggleReadingMode]);

  return (
    <ReadingModeProvider value={readingModeValue}>
      <PageShell
        rootClassName={cn(rootClassName, isReadingMode && 'reading-mode')}
        sidebarOpen={sidebarOpen}
        onMenuToggle={onMenuToggle}
        hideHeader={isReadingMode}
        showReadingModeToggle
        onReadingModeDirectoryOpen={
          isReadingMode && sidebarMeta && !isReadonlyMode
            ? () => setIsReadingModeDirectoryOpen(true)
            : null
        }
      >
        {isReadingMode && sidebarMeta && !isReadonlyMode ? (
          <Sidebar
            meta={sidebarMeta}
            isOpen={isReadingModeDirectoryOpen}
            onClose={() => setIsReadingModeDirectoryOpen(false)}
            className="reading-mode-overlay"
            overlayClassName="reading-mode-overlay"
            linkSearch={modeSearch}
          />
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
