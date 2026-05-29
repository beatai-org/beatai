import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiHome } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import ThemeSelector from '../ThemeSelector';
import AuthStatus from './AuthStatus';
import { useAuthContext } from '../../contexts/AuthContext';
import { getBookByPathname } from '../../content';
import { HOME_PATH } from '../../utils/siteRoutes';

function BookFloatingActions({
  sidebarOpen = false,
  onMenuToggle = null
}) {
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();
  const activeBook = getBookByPathname(location.pathname);
  const activeGithubRepo = activeBook?.githubRepo || null;

  return (
    <div className="book-floating-actions">
      {onMenuToggle && (
        <button
          type="button"
          className="book-fa-menu-toggle"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <HiX /> : <HiMenu />}
        </button>
      )}

      <Link
        to={HOME_PATH}
        className="book-fa-home"
        aria-label="返回首页"
        title="返回首页"
      >
        <HiHome />
      </Link>

      {isAuthenticated && (
        <div className="book-fa-auth">
          <AuthStatus />
        </div>
      )}

      {activeGithubRepo && (
        <a
          href={activeGithubRepo}
          target="_blank"
          rel="noopener noreferrer"
          className="book-fa-github"
          aria-label={`访问 ${activeBook.title} 的 GitHub 仓库`}
          title={`访问 ${activeBook.title} 的 GitHub 仓库`}
        >
          <FaGithub />
        </a>
      )}

      <ThemeSelector />
    </div>
  );
}

export default BookFloatingActions;
