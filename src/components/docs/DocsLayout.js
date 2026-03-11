import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './DocsLayout.css';
import '../../styles/Background.css';
import '../../styles/3d-effects.css';
import '../../styles/animations.css';
import ThemeToggle from '../ThemeToggle';
import ThemeSelector from '../ThemeSelector';
import Sidebar from './Sidebar';
import AIAssistant from './AIAssistant';
import AnnotationSystem from './AnnotationSystem';
import { HiMenu, HiX } from 'react-icons/hi';
import logo from '../../assets/logo.jpg';

const DocsLayout = ({ meta, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract categories from meta with useMemo to prevent recreation
  const categories = useMemo(() => meta?.categories || [], [meta]);

  // Determine active category based on current path
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (!categories.length) return;

    // Find which category the current path belongs to
    const current = categories.find(cat =>
      cat.sections.some(section =>
        section.items?.some(item => {
          // Check if current path matches this item or its children
          const matchPath = (i) => {
            if (location.pathname === i.path) return true;
            if (i.children) {
              return i.children.some(child => matchPath(child));
            }
            return false;
          };
          return matchPath(item);
        })
      )
    );

    if (current) {
      setActiveCategory(current);
    } else {
      // Default to first category if no match found
      setActiveCategory(categories[0]);
    }
  }, [location.pathname, categories]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);

    // Navigate to the first item in the first section of this category
    const firstSection = category.sections?.[0];
    const firstItem = firstSection?.items?.[0];

    if (firstItem?.path) {
      navigate(firstItem.path);
    }
  };

  // Prepare meta object for Sidebar (using only active category's sections)
  const sidebarMeta = activeCategory ? {
    title: activeCategory.title,
    sections: activeCategory.sections
  } : null;

  return (
    <div className="docs-layout dynamic-background">
      {/* Header with glassmorphism */}
      <header className="docs-header glass-morphism">
        <div className="docs-header-content">
          <Link to="/" className="docs-logo">
            <img src={logo} alt="BeatAI" className="logo-image" />
            <span className="logo-text">BeatAI</span>
          </Link>

          {/* Category Navigation */}
          <nav className="category-nav">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-tab ${activeCategory?.id === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category.title}
              </button>
            ))}
          </nav>

          <div className="docs-header-actions">
            <ThemeToggle />
            <ThemeSelector />
            <button
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </header>

      <div className="docs-container">
        {/* Sidebar - shows only current category's sections */}
        {sidebarMeta && (
          <Sidebar
            meta={sidebarMeta}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="docs-main">
          {children}
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Annotation System */}
      <AnnotationSystem />
    </div>
  );
};

export default DocsLayout;
