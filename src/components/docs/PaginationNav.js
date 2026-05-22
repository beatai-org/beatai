import React from 'react';
import { Link } from 'react-router-dom';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { useReadingMode } from '../../contexts/ReadingModeContext';

const PaginationNav = ({ prev, next }) => {
  const { isReadingMode, modeSearch } = useReadingMode();

  // 如果前后都没有章节，不显示组件
  if (!prev && !next) {
    return null;
  }

  // 点击导航时强制滚动到顶部
  const handleNavClick = () => {
    window.scrollTo(0, 0);
  };

  const buildTo = (path) =>
    isReadingMode && modeSearch ? { pathname: path, search: modeSearch } : path;

  return (
    <nav className="pagination-nav">
      {/* 上一章按钮 */}
      <div className="pagination-item">
        {prev ? (
          <Link to={buildTo(prev.path)} className="pagination-link prev" onClick={handleNavClick}>
            <HiArrowLeft className="pagination-icon" />
            <div className="pagination-content">
              <span className="pagination-label">上一章</span>
              <span className="pagination-title">{prev.title}</span>
              <span className="pagination-section">{prev.section}</span>
            </div>
          </Link>
        ) : (
          <div className="pagination-placeholder" />
        )}
      </div>

      {/* 下一章按钮 */}
      <div className="pagination-item">
        {next ? (
          <Link to={buildTo(next.path)} className="pagination-link next" onClick={handleNavClick}>
            <div className="pagination-content">
              <span className="pagination-label">下一章</span>
              <span className="pagination-title">{next.title}</span>
              <span className="pagination-section">{next.section}</span>
            </div>
            <HiArrowRight className="pagination-icon" />
          </Link>
        ) : (
          <div className="pagination-placeholder" />
        )}
      </div>
    </nav>
  );
};

export default PaginationNav;
