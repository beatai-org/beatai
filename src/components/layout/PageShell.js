import React from 'react';
import AppHeader from '../AppHeader/AppHeader';
import ReadingModeFloatingActions from '../docs/ReadingModeFloatingActions';

function PageShell({
  rootClassName = '',
  sidebarOpen = false,
  onMenuToggle = null,
  hideHeader = false,
  showReadingModeToggle = false,
  onReadingModeDirectoryOpen = null,
  children
}) {
  const classes = [rootClassName, 'dynamic-background'].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="sailor-moon-bg-layer"></div>

      {!hideHeader && (
        <AppHeader
          sidebarOpen={sidebarOpen}
          onMenuToggle={onMenuToggle}
          showReadingModeToggle={showReadingModeToggle}
        />
      )}

      {hideHeader && showReadingModeToggle && (
        <ReadingModeFloatingActions onDirectoryOpen={onReadingModeDirectoryOpen} />
      )}

      {children}
    </div>
  );
}

export default PageShell;
