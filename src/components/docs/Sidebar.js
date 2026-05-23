import React, { useRef, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { RepoCard } from '../common';
import { normalizeMetaPath } from '../../utils/docsMetaSelectors';

function SidebarTitle({ title }) {
  return (
    <span className="sidebar-title-with-badge">
      <span className="sidebar-title-text">{title}</span>
    </span>
  );
}

const Sidebar = ({ meta, isOpen, onClose, className = '', overlayClassName = '', linkSearch = '' }) => {
  const navRef = useRef(null);
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  // Auto-expand parent items based on current location
  useEffect(() => {
    if (!meta || !meta.sections) return;

    const normalizedCurrentPath = normalizeMetaPath(location.pathname);

    const findAndExpandParents = (items, currentPath, parents = []) => {
      for (const item of items) {
        const newParents = [...parents, item.path];

        // Check if current item matches the current path
        if (normalizeMetaPath(item.path) === currentPath) {
          // Expand all parent paths
          const expandState = {};
          parents.forEach(parentPath => {
            expandState[parentPath] = true;
          });
          if (item.children && item.children.length > 0) {
            expandState[item.path] = true;
          }
          setExpandedItems(expandState);
          return true;
        }

        // Recursively search in children
        if (item.children && item.children.length > 0) {
          if (findAndExpandParents(item.children, currentPath, newParents)) {
            return true;
          }
        }
      }
      return false;
    };

    // Search through all sections
    for (const section of meta.sections) {
      if (section.items) {
        findAndExpandParents(section.items, normalizedCurrentPath);
      }
    }
  }, [location.pathname, meta]);

  // Auto-scroll to active navigation item
  useEffect(() => {
    if (!navRef.current) return;

    // Delay to ensure DOM updates after menu expansion
    const timer = setTimeout(() => {
      const activeLink = navRef.current.querySelector('.sidebar-link.active');
      if (activeLink) {
        activeLink.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Only trigger on route change, not on manual expand/collapse

  // Toggle expand/collapse for items with children
  const toggleExpand = (path) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const expandAndNavigate = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleParentItemClick = (path) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: true
    }));
    expandAndNavigate();
  };

  const buildLinkTo = (path) =>
    linkSearch ? { pathname: path, search: linkSearch } : path;

  // Recursive component to render nested menu items
  const renderMenuItem = (item, level = 1) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.path];
    const isActive = item.highlightable === false
      ? false
      : normalizeMetaPath(location.pathname) === normalizeMetaPath(item.path);
    const indent = level > 1 ? `${(level - 1) * 16}px` : '0px';

    return (
      <li key={item.path} className="sidebar-item">
        <div className="sidebar-item-wrapper" style={{ paddingLeft: indent }}>
          {hasChildren ? (
            <>
              <NavLink
                to={buildLinkTo(item.path)}
                className={() =>
                  `sidebar-link sidebar-link-with-children ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`
                }
                onClick={() => handleParentItemClick(item.path)}
              >
                <SidebarTitle title={item.title} />
                <span
                  className="sidebar-expand-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleExpand(item.path);
                  }}
                >
                  {isExpanded ? '−' : '+'}
                </span>
              </NavLink>
              {isExpanded && (
                <ul className="sidebar-items sidebar-items-nested">
                  {item.children.map((child) => renderMenuItem(child, level + 1))}
                </ul>
              )}
            </>
          ) : (
            <NavLink
              to={buildLinkTo(item.path)}
              className={() =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <SidebarTitle title={item.title} />
              <span className="sidebar-link-indicator"></span>
            </NavLink>
          )}
        </div>
      </li>
    );
  };

  if (!meta) return null;

  // Extract repository info from meta if available
  const repoInfo = meta.githubRepo ? {
    url: meta.githubRepo,
    owner: meta.githubRepo.split('/').slice(-2)[0] || '',
    name: meta.githubRepo.split('/').slice(-1)[0] || '',
    title: meta.repoTitle || '繁星点点，只因有你'
  } : null;
  const bookPath = meta.bookPath || null;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className={`sidebar-overlay ${overlayClassName}`.trim()} onClick={onClose} />}

      <aside className={`docs-sidebar ${isOpen ? 'open' : ''} ${className}`.trim()} ref={navRef}>
        {/* GitHub Repository Card - Show if repo info available */}
        {repoInfo && (
          <RepoCard
            repoUrl={repoInfo.url}
            repoOwner={repoInfo.owner}
            repoName={repoInfo.name}
            title={repoInfo.title}
          />
        )}

        {bookPath && (
          <div
            className="sidebar-section sidebar-book-path-card"
            aria-label="当前书籍路径"
          >
            <div className="sidebar-section-header sidebar-book-path-row">
              <div className="sidebar-book-path-value">
                <span className="sidebar-book-path-parent">{bookPath.parentTitle}</span>
                <span className="sidebar-book-path-separator">/</span>
                <span className="sidebar-book-path-current">{bookPath.currentTitle}</span>
              </div>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {meta.sections.map((section, idx) => (
            <div
              key={idx}
              className="sidebar-section"
            >
              <div className="sidebar-section-header">
                <h3 className="sidebar-section-title">
                  <SidebarTitle title={section.title} />
                </h3>
              </div>
              <ul className="sidebar-items">
                {section.items.map((item) => renderMenuItem(item))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
