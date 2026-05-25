import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import ThemeSelector from '../ThemeSelector';
import ReadingModeToggleButton from '../docs/ReadingModeToggleButton';
import AuthStatus from '../docs/AuthStatus';
import { preloadRouteForPath } from '../../utils/routePrefetch';
import { SITE_CONFIG } from '../../utils/siteConfig';
import { HOME_PATH } from '../../utils/siteRoutes';
import {
  getActiveTopNavItem,
  getBookById,
  getTopNavItems
} from '../../content';

/**
 * Top header. Nav items come from src/content/topNav.js; the GitHub icon
 * next to the active item is derived from the book's `githubRepo` field
 * (collections / route entries don't show one).
 */
const AppHeader = ({
  sidebarOpen = false,
  onMenuToggle = null,
  showReadingModeToggle = false
}) => {
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const mobileDropdownRef = useRef(null);
  const location = useLocation();

  const navItems = useMemo(() => getTopNavItems(), []);
  const activeNavItem = getActiveTopNavItem(location.pathname);
  const activeGithubRepo = activeNavItem ? getBookById(activeNavItem.id)?.githubRepo : null;

  useEffect(() => {
    setMobileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileDropdownOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      setMobileDropdownOpen(false);
    };

    const handlePointerDown = (event) => {
      if (!mobileDropdownRef.current?.contains(event.target)) {
        setMobileDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [mobileDropdownOpen]);

  const preloadNavItem = (item) => {
    preloadRouteForPath(item.href);
  };

  return (
    <header className="app-header glass-morphism">
      <div className="app-header-content">
        {/* Desktop brand text */}
        <Link to={HOME_PATH} className="app-logo desktop-only">
          <span className="logo-text">{SITE_CONFIG.brandName}</span>
        </Link>

        {/* Mobile brand text */}
        <Link to={HOME_PATH} className="app-logo-mobile mobile-only">
          <span className="logo-text">{SITE_CONFIG.brandName}</span>
        </Link>

        {/* Mobile Category Dropdown */}
        <div className="mobile-category-wrapper mobile-only">
          <div
            ref={mobileDropdownRef}
            className={`mobile-category-dropdown ${mobileDropdownOpen ? 'open' : ''}`}
          >
            <button
              type="button"
              className="mobile-category-toggle"
              aria-expanded={mobileDropdownOpen}
              aria-haspopup="menu"
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            >
              <span>{activeNavItem?.label || SITE_CONFIG.labels.selectBook}</span>
              <HiChevronDown className={`dropdown-icon ${mobileDropdownOpen ? 'open' : ''}`} />
            </button>
            {mobileDropdownOpen && (
              <div className="mobile-category-menu" role="menu">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    role="menuitem"
                    className={`mobile-category-item ${activeNavItem?.id === item.id ? 'active' : ''}`}
                    onMouseEnter={() => preloadNavItem(item)}
                    onFocus={() => preloadNavItem(item)}
                    onTouchStart={() => preloadNavItem(item)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {activeGithubRepo && (
            <a
              href={activeGithubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="github-link-mobile"
              title={`访问 ${activeNavItem.label} 的 GitHub 仓库`}
            >
              <FaGithub />
            </a>
          )}
        </div>

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
                {isActive && activeGithubRepo && (
                  <a
                    href={activeGithubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link-inline"
                    title={`访问 ${item.label} 的 GitHub 仓库`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaGithub />
                  </a>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="app-header-actions">
          <AuthStatus />
          {showReadingModeToggle && <ReadingModeToggleButton />}
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
