import React from 'react';

/**
 * RepoCard - 通用的 GitHub 仓库卡片组件
 *
 * @param {Object} props
 * @param {string} props.repoUrl - GitHub 仓库 URL
 * @param {string} props.repoOwner - 仓库所有者
 * @param {string} props.repoName - 仓库名称
 * @param {string} props.title - 卡片标题（可选）
 * @param {string} props.className - 额外的 CSS 类名（可选）
 */
const RepoCard = ({
  repoUrl,
  repoOwner,
  repoName,
  title = '',
  className = ''
}) => {
  // 如果没有提供仓库信息，不渲染组件
  if (!repoUrl || !repoOwner || !repoName) {
    return null;
  }

  return (
    <div className={`repo-card glass-morphism ${className}`}>
      <div className="repo-card-icon">
        <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      </div>
      <div className="repo-card-content">
        {title && <div className="repo-card-title">{title}</div>}
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="repo-card-url"
        >
          {repoOwner}/{repoName}
        </a>
      </div>
    </div>
  );
};

export default RepoCard;
