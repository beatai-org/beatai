import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { RepoCard } from '../common';
import { normalizeMetaPath } from '../../utils/docsMeta';
import './Sidebar.css';
import '../../styles/3d-effects.css';

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isPublishedToday(publishedAt) {
  return Boolean(publishedAt) && publishedAt === getTodayDateString();
}

function GlobalNewBadge({ anchorRef, visible }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!visible) {
      setPosition(null);
      return undefined;
    }

    let frameId = null;
    let resizeObserver = null;

    const updatePosition = () => {
      const anchor = anchorRef.current;

      if (!anchor) {
        setPosition(null);
        return;
      }

      const rect = anchor.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(anchor);
      const fontSize = Number.parseFloat(computedStyle.fontSize) || 14;
      const resolvedLineHeight = computedStyle.lineHeight === 'normal'
        ? fontSize * 1.4
        : Number.parseFloat(computedStyle.lineHeight) || fontSize * 1.4;

      setPosition({
        left: rect.left - 2,
        top: rect.top + resolvedLineHeight / 2 + 1
      });
    };

    const scheduleUpdate = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updatePosition();
      });
    };

    scheduleUpdate();
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('scroll', scheduleUpdate, true);

    if (typeof ResizeObserver !== 'undefined' && anchorRef.current) {
      resizeObserver = new ResizeObserver(scheduleUpdate);
      resizeObserver.observe(anchorRef.current);
    }

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate, true);
      resizeObserver?.disconnect();
    };
  }, [anchorRef, visible]);

  if (!visible || !position || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <span
      className="sidebar-global-new-badge"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`
      }}
    >
      new
    </span>,
    document.body
  );
}

function TitleWithNewBadge({ title, publishedAt }) {
  const showNewBadge = isPublishedToday(publishedAt);
  const titleRef = useRef(null);

  return (
    <span className="sidebar-title-with-badge">
      <span ref={titleRef} className="sidebar-title-text">
        {title}
      </span>
      <GlobalNewBadge anchorRef={titleRef} visible={showNewBadge} />
    </span>
  );
}

const Sidebar = ({ meta, isOpen, onClose, className = '', overlayClassName = '' }) => {
  const sectionRefs = useRef({});
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

  // Mouse tracking for 3D tilt effect (minimal rotation for subtle visual depth)
  const handleMouseMove = (e, idx) => {
    const card = sectionRefs.current[idx];
    if (!card || window.innerWidth <= 968) return; // Disable on mobile

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Minimal rotation: max 1 degree for barely noticeable tilt
    const rotateX = ((y - centerY) / centerY) * -1;
    const rotateY = ((x - centerX) / centerX) * 1;

    // Very subtle Z-axis lift
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(2px)`;
  };

  const handleMouseLeave = (idx) => {
    const card = sectionRefs.current[idx];
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

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
                to={item.path}
                className={() =>
                  `sidebar-link sidebar-link-with-children ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`
                }
                onClick={() => handleParentItemClick(item.path)}
              >
                <TitleWithNewBadge title={item.title} publishedAt={item.publishedAt} />
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
              to={item.path}
              className={() =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <TitleWithNewBadge title={item.title} publishedAt={item.publishedAt} />
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
            className="sidebar-section card-3d glass-morphism sidebar-book-path-card"
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
              ref={(el) => (sectionRefs.current[idx] = el)}
              className="sidebar-section card-3d glass-morphism"
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
            >
              <div className="sidebar-section-header">
                <h3 className="sidebar-section-title">
                  <TitleWithNewBadge title={section.title} publishedAt={section.publishedAt} />
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
