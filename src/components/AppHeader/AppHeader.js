import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import ThemeSelector from '../ThemeSelector';
import AuthStatus from '../docs/AuthStatus';
import BookCategoryDropdown from './BookCategoryDropdown';
import { preloadRouteForPath } from '../../utils/routePrefetch';
import { SITE_CONFIG } from '../../utils/siteConfig';
import { HOME_PATH } from '../../utils/siteRoutes';
import {
  getActiveTopNavItem,
  getBookByPathname,
  getTopNavItems
} from '../../content';

/**
 * Top header. Nav items come from src/content/topNav.js; the GitHub icon
 * next to the active item is derived from the book's `githubRepo` field
 * (collections / route entries don't show one).
 */
const AppHeader = ({
  sidebarOpen = false,
  onMenuToggle = null
}) => {
  const location = useLocation();

  const navItems = getTopNavItems();
  const activeNavItem = getActiveTopNavItem(location.pathname);
  const activeBook = getBookByPathname(location.pathname);
  const activeGithubRepo = activeBook?.githubRepo || null;

  const preloadNavItem = (item) => {
    preloadRouteForPath(item.href);
  };

  return (
    <header className="app-header">
      <div className="app-header-content">
        {/* Desktop brand text — hidden on mobile via .desktop-only.
            (Mobile-specific brand was removed so the book selector sits
            flush against the left edge of the header on small screens.) */}
        <Link to={HOME_PATH} className="app-logo desktop-only">
          <span className="logo-text">{SITE_CONFIG.brandName}</span>
        </Link>

        {/* Mobile Category Dropdown */}
        <BookCategoryDropdown className="mobile-only" />

        {/* Desktop Category Navigation */}
        <nav className="category-nav desktop-only">
          {navItems.map((item) => {
            const isActive = activeNavItem?.id === item.id;
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`category-tab ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadNavItem(item)}
                onFocus={() => preloadNavItem(item)}
                onTouchStart={() => preloadNavItem(item)}
              >
                <span className="category-title">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="app-header-actions">
          <AuthStatus />
          {activeGithubRepo && (
            <a
              href={activeGithubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="app-header-github-btn"
              aria-label={`访问 ${activeBook.title} 的 GitHub 仓库`}
              title={`访问 ${activeBook.title} 的 GitHub 仓库`}
            >
              <FaGithub />
            </a>
          )}
          <ThemeSelector />
          {onMenuToggle && (
            <button
              className="mobile-menu-toggle"
              onClick={onMenuToggle}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <HiX /> : <HiMenu />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
