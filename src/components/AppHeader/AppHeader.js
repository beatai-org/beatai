import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import ThemeSelector from '../ThemeSelector';
import AuthStatus from '../docs/AuthStatus';
import BeatAILogoWave from '../BeatAILogoWave';
import './AppHeader.css';

// GitHub repository mapping for each book
const GITHUB_REPOS = {
  'ai-insights': 'https://github.com/beatai-org/beatai',
  'rust-course': 'https://github.com/sunface/rust-course'
};

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
  const location = useLocation();
  const navigate = useNavigate();
  const showCategoryNav = categories.length > 0 && onCategoryClick;
  const isLearnClaudeCodeActive = location.pathname.startsWith('/learn-claude-code');

  const handleMobileCategoryClick = (category) => {
    onCategoryClick(category);
    setMobileDropdownOpen(false);
  };

  const handleMobileLearnClaudeCodeClick = () => {
    navigate('/learn-claude-code/preface');
    setMobileDropdownOpen(false);
  };

  return (
    <header className="app-header glass-morphism">
      <div className="app-header-content">
        {/* Desktop Logo */}
        <Link to="/square" className="app-logo desktop-only">
          <BeatAILogoWave size={32} />
          <span className="logo-text">BeatAI</span>
        </Link>

        {/* Mobile Logo - 始终显示 */}
        <Link to="/square" className="app-logo-mobile mobile-only">
          <BeatAILogoWave size={28} />
        </Link>

        {/* Mobile Category Dropdown */}
        {showCategoryNav ? (
          <div className="mobile-category-wrapper mobile-only">
            <div className="mobile-category-dropdown">
              <button
                className="mobile-category-toggle"
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              >
                <span>{isLearnClaudeCodeActive ? 'Learn Claude Code' : (activeCategory?.title || '选择书籍')}</span>
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
                  <button
                    className={`mobile-category-item ${isLearnClaudeCodeActive ? 'active' : ''}`}
                    onClick={handleMobileLearnClaudeCodeClick}
                  >
                    Learn Claude Code
                  </button>
                </div>
              )}
            </div>
            {/* GitHub icon next to the dropdown */}
            {activeCategory && GITHUB_REPOS[activeCategory.id] && (
              <a
                href={GITHUB_REPOS[activeCategory.id]}
                target="_blank"
                rel="noopener noreferrer"
                className="github-link-mobile"
                title={`访问 ${activeCategory.title} 的 GitHub 仓库`}
              >
                <FaGithub />
              </a>
            )}
          </div>
        ) : (
          /* 在没有分类导航的页面，添加占位空间 */
          <div className="mobile-spacer mobile-only"></div>
        )}

        {/* Desktop Category Navigation */}
        <nav className="category-nav desktop-only">
          {showCategoryNav && categories.map(category => (
            <button
              key={category.id}
              className={`category-tab ${activeCategory?.id === category.id ? 'active' : ''}`}
              onClick={() => onCategoryClick(category)}
            >
              <span className="category-title">{category.title}</span>
              {activeCategory?.id === category.id && GITHUB_REPOS[category.id] && (
                <a
                  href={GITHUB_REPOS[category.id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link-inline"
                  title={`访问 ${category.title} 的 GitHub 仓库`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaGithub />
                </a>
              )}
            </button>
          ))}

          <Link
            to="/learn-claude-code/preface"
            className={`category-tab category-link ${isLearnClaudeCodeActive ? 'active' : ''}`}
          >
            <span className="category-title">Learn Claude Code</span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="app-header-actions">
          <AuthStatus />
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
