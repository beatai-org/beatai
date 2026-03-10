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
  }, [location.pathname, expandedItems]);

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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`docs-sidebar ${isOpen ? 'open' : ''}`} ref={navRef}>
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
