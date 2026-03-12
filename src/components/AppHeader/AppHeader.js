import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import ThemeToggle from '../ThemeToggle';
import ThemeSelector from '../ThemeSelector';
import AuthStatus from '../docs/AuthStatus';
import logo from '../../assets/logo.jpg';
import './AppHeader.css';

/**
 * 应用统一 Header 组件
 *
 * @param {Object} props
 * @param {Array} props.categories - 分类导航数据（可选）
 * @param {Object} props.activeCategory - 当前激活的分类（可选）
 * @param {Function} props.onCategoryClick - 分类点击回调（可选）
 * @param {boolean} props.sidebarOpen - 侧边栏打开状态（可选）
 * @param {Function} props.onMenuToggle - 菜单切换回调（可选）
 */
const AppHeader = ({
  categories = [],
  activeCategory = null,
  onCategoryClick = null,
  sidebarOpen = false,
  onMenuToggle = null
}) => {
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const showCategoryNav = categories.length > 0 && onCategoryClick;

  const handleMobileCategoryClick = (category) => {
    onCategoryClick(category);
    setMobileDropdownOpen(false);
  };

  return (
    <header className="app-header glass-morphism">
      <div className="app-header-content">
        {/* Desktop Logo */}
        <Link to="/" className="app-logo desktop-only">
          <img src={logo} alt="BeatAI" className="logo-image" />
          <span className="logo-text">BeatAI</span>
        </Link>

        {/* Mobile Category Dropdown */}
        {showCategoryNav && (
          <div className="mobile-category-dropdown mobile-only">
            <button
              className="mobile-category-toggle"
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            >
              <span>{activeCategory?.title || '选择书籍'}</span>
              <HiChevronDown className={`dropdown-icon ${mobileDropdownOpen ? 'open' : ''}`} />
            </button>
            {mobileDropdownOpen && (
              <div className="mobile-category-menu">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`mobile-category-item ${activeCategory?.id === category.id ? 'active' : ''}`}
                    onClick={() => handleMobileCategoryClick(category)}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Desktop Category Navigation */}
        {showCategoryNav && (
          <nav className="category-nav desktop-only">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-tab ${activeCategory?.id === category.id ? 'active' : ''}`}
                onClick={() => onCategoryClick(category)}
              >
                {category.title}
              </button>
            ))}
          </nav>
        )}

        {/* Actions */}
        <div className="app-header-actions">
          <AuthStatus />
          <ThemeToggle />
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
