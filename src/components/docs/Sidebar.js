import React, { useRef, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';
import '../../styles/3d-effects.css';

const Sidebar = ({ meta, isOpen, onClose }) => {
  const sectionRefs = useRef({});
  const navRef = useRef(null);
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  // Auto-expand parent items based on current location
  useEffect(() => {
    if (!meta || !meta.sections) return;

    const findAndExpandParents = (items, currentPath, parents = []) => {
      for (const item of items) {
        const newParents = [...parents, item.path];

        // Check if current item matches the current path
        if (item.path === currentPath) {
          // Expand all parent paths
          const expandState = {};
          parents.forEach(parentPath => {
            expandState[parentPath] = true;
          });
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
        findAndExpandParents(section.items, location.pathname);
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
    const indent = level > 1 ? `${(level - 1) * 16}px` : '0px';

    return (
      <li key={item.path} className="sidebar-item">
        <div className="sidebar-item-wrapper" style={{ paddingLeft: indent }}>
          {hasChildren ? (
            <>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link sidebar-link-with-children ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`
                }
                onClick={onClose}
              >
                <span className="sidebar-link-text">{item.title}</span>
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
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <span className="sidebar-link-text">{item.title}</span>
              <span className="sidebar-link-indicator"></span>
            </NavLink>
          )}
        </div>
      </li>
    );
  };

  if (!meta) return null;

  // Check if current path is under rust-course
  const isRustCourse = location.pathname.startsWith('/rust-course');

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`docs-sidebar ${isOpen ? 'open' : ''}`} ref={navRef}>
        {/* GitHub Repository Link - Only for Rust Course */}
        {isRustCourse && (
          <div className="sidebar-repo-link glass-morphism">
            <div className="sidebar-repo-icon">
              <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </div>
            <div className="sidebar-repo-content">
              <div className="sidebar-repo-title">繁星点点，只因有你</div>
              <a
                href="https://github.com/sunface/rust-course"
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-repo-url"
              >
                sunface/rust-course
              </a>
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
                <h3 className="sidebar-section-title">{section.title}</h3>
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
