import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import ThemeSelector from '../ThemeSelector';
import AuthStatus from '../docs/AuthStatus';
import ReadingModeToggleButton from '../docs/ReadingModeToggleButton';
import BeatAILogoWave from '../BeatAILogoWave';
import './AppHeader.css';

/**
 * 应用统一 Header 组件
 *
 * @param {Object} props
 * @param {Array} props.spaces - 顶部知识空间导航数据（可选）
 * @param {Object} props.activeSpace - 当前激活的知识空间（可选）
 * @param {Function} props.onSpaceClick - 知识空间点击回调（可选）
 * @param {boolean} props.sidebarOpen - 侧边栏打开状态（可选）
 * @param {Function} props.onMenuToggle - 菜单切换回调（可选）
 * @param {boolean} props.showReadingModeToggle - 是否显示阅读模式按钮（可选）
 */
const AppHeader = ({
  spaces = [],
  activeSpace = null,
  onSpaceClick = null,
  sidebarOpen = false,
  onMenuToggle = null,
  showReadingModeToggle = false
}) => {
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [desktopLogoAnimated, setDesktopLogoAnimated] = useState(false);
  const [mobileLogoAnimated, setMobileLogoAnimated] = useState(false);
  const mobileDropdownRef = useRef(null);
  const location = useLocation();
  const showSpaceNav = spaces.length > 0 && onSpaceClick;

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

  const handleMobileSpaceClick = (space) => {
    onSpaceClick(space);
    setMobileDropdownOpen(false);
  };

  return (
    <header className="app-header glass-morphism">
      <div className="app-header-content">
        {/* Desktop Logo */}
        <Link
          to="/square"
          className="app-logo desktop-only"
          onMouseEnter={() => setDesktopLogoAnimated(true)}
          onMouseLeave={() => setDesktopLogoAnimated(false)}
        >
          <BeatAILogoWave size={32} animated={desktopLogoAnimated} />
          <span className="logo-text">BeatAI</span>
        </Link>

        {/* Mobile Logo - 始终显示 */}
        <Link
          to="/square"
          className="app-logo-mobile mobile-only"
          onMouseEnter={() => setMobileLogoAnimated(true)}
          onMouseLeave={() => setMobileLogoAnimated(false)}
        >
          <BeatAILogoWave size={28} animated={mobileLogoAnimated} />
        </Link>

        {/* Mobile Category Dropdown */}
        {showSpaceNav ? (
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
                <span>{activeSpace?.title || '选择书籍'}</span>
                <HiChevronDown className={`dropdown-icon ${mobileDropdownOpen ? 'open' : ''}`} />
              </button>
              {mobileDropdownOpen && (
                <div className="mobile-category-menu" role="menu">
                  {spaces.map((space) => (
                    <button
                      key={space.id}
                      type="button"
                      className={`mobile-category-item ${activeSpace?.id === space.id ? 'active' : ''}`}
                      onClick={() => handleMobileSpaceClick(space)}
                    >
                      {space.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* GitHub icon next to the dropdown */}
            {activeSpace?.githubRepo && (
              <a
                href={activeSpace.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="github-link-mobile"
                title={`访问 ${activeSpace.title} 的 GitHub 仓库`}
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
          {showSpaceNav && spaces.map((space) => (
            <button
              key={space.id}
              className={`category-tab ${activeSpace?.id === space.id ? 'active' : ''}`}
              onClick={() => onSpaceClick(space)}
            >
              <span className="category-title">{space.title}</span>
              {activeSpace?.id === space.id && space.githubRepo && (
                <a
                  href={space.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link-inline"
                  title={`访问 ${space.title} 的 GitHub 仓库`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaGithub />
                </a>
              )}
            </button>
          ))}
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
