import React from 'react';
import { Link } from 'react-router-dom';
import { preloadMarkdownFile } from '../../utils/markdownPrefetch';
import { preloadRouteForPath } from '../../utils/routePrefetch';

const ArchiveList = ({ groups, onArticleNavigate = null }) => {
  const preloadArticleAssets = (article) => {
    preloadMarkdownFile(article.file);
    preloadRouteForPath(article.path);
  };

  return (
    <div className="archive-list">
      {groups.map(({ date, articles }) => (
        <section key={date} className="archive-list-group">
          <h2 className="archive-list-date">
            <span className="archive-list-date-mark">##</span>
            <span className="archive-list-date-value">{date}</span>
          </h2>
          <ul className="archive-list-items">
            {articles.map((article) => (
              <li key={article.path} className="archive-list-item">
                <span className="archive-list-bullet">-</span>
                <Link
                  to={article.path}
                  className="archive-list-link"
                  data-ai-insights-article-path={article.path}
                  onMouseEnter={() => preloadArticleAssets(article)}
                  onFocus={() => preloadArticleAssets(article)}
                  onTouchStart={() => preloadArticleAssets(article)}
                  onClick={(event) => onArticleNavigate?.(article, event)}
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default ArchiveList;
