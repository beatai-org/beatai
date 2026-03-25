import React from 'react';
import AppHeader from '../AppHeader/AppHeader';
import Footer from '../Footer/Footer';
import ReadingModeFloatingActions from '../docs/ReadingModeFloatingActions';

function PageShell({
  rootClassName = '',
  spaces = null,
  activeSpace = null,
  onSpaceClick = null,
  categories = [],
  activeCategory = null,
  onCategoryClick = null,
  sidebarOpen = false,
  onMenuToggle = null,
  showFooter = true,
  hideHeader = false,
  showReadingModeToggle = false,
  children
}) {
  const classes = [rootClassName, 'dynamic-background'].filter(Boolean).join(' ');
  const resolvedSpaces = spaces || categories;
  const resolvedActiveSpace = activeSpace || activeCategory;
  const resolvedOnSpaceClick = onSpaceClick || onCategoryClick;

  return (
    <div className={classes}>
      <div className="sailor-moon-bg-layer"></div>

      {!hideHeader && (
        <AppHeader
          spaces={resolvedSpaces}
          activeSpace={resolvedActiveSpace}
          onSpaceClick={resolvedOnSpaceClick}
          sidebarOpen={sidebarOpen}
          onMenuToggle={onMenuToggle}
          showReadingModeToggle={showReadingModeToggle}
        />
      )}

      {hideHeader && showReadingModeToggle && <ReadingModeFloatingActions />}

      {children}

      {showFooter && <Footer />}
    </div>
  );
}

export default PageShell;
