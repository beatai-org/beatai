import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import ThemeSelector from '../ThemeSelector';
import AuthStatus from '../docs/AuthStatus';
import BeatAILogoWave from '../BeatAILogoWave';
import { getLearnClaudeCodePath } from '../../utils/learnAiPaths';
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
  const mobileDropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const showCategoryNav = categories.length > 0 && onCategoryClick;
  const isLearnClaudeCodeActive = location.pathname.startsWith('/learn-ai/');

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

  const handleMobileCategoryClick = (category) => {
    onCategoryClick(category);
    setMobileDropdownOpen(false);
  };

  const handleMobileLearnClaudeCodeClick = () => {
    navigate(getLearnClaudeCodePath('preface'));
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
                <span>{isLearnClaudeCodeActive ? 'AI 学习宝典' : (activeCategory?.title || '选择书籍')}</span>
                <HiChevronDown className={`dropdown-icon ${mobileDropdownOpen ? 'open' : ''}`} />
              </button>
              {mobileDropdownOpen && (
                <div className="mobile-category-menu" role="menu">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      type="button"
                      className={`mobile-category-item ${activeCategory?.id === category.id ? 'active' : ''}`}
                      onClick={() => handleMobileCategoryClick(category)}
                    >
                      {category.title}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`mobile-category-item ${isLearnClaudeCodeActive ? 'active' : ''}`}
                    onClick={handleMobileLearnClaudeCodeClick}
                  >
                    AI 学习宝典
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
            to={getLearnClaudeCodePath('preface')}
            className={`category-tab category-link ${isLearnClaudeCodeActive ? 'active' : ''}`}
          >
            <span className="category-title">AI 学习宝典</span>
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
