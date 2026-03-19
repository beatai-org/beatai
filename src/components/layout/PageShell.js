import React from 'react';
import AppHeader from '../AppHeader/AppHeader';
import Footer from '../Footer/Footer';

function PageShell({
  rootClassName = '',
  categories = [],
  activeCategory = null,
  onCategoryClick = null,
  sidebarOpen = false,
  onMenuToggle = null,
  showFooter = true,
  children
}) {
  const classes = [rootClassName, 'dynamic-background'].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="sailor-moon-bg-layer"></div>

      <AppHeader
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={onCategoryClick}
        sidebarOpen={sidebarOpen}
        onMenuToggle={onMenuToggle}
      />

      {children}

      {showFooter && <Footer />}
    </div>
  );
}

export default PageShell;
