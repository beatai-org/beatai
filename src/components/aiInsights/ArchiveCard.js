import React from 'react';
import { Link } from 'react-router-dom';
import { resolveMarkdownAssetUrl, resolvePublicContentUrl } from '../../utils/markdown';
import { preloadMarkdownFile } from '../../utils/markdownPrefetch';
import { preloadRouteForPath } from '../../utils/routePrefetch';

// /ai-insights 列表卡片：展示数据全部来自 _meta.json 的 article 条目
// （title / excerpt / cover / path / file）。刻意不 fetch 文章 .md 原文——
// 列表页有几十张卡片，逐篇拉 md 太重。excerpt 来源有二：作者写的副标题
// （medium-fetch/substack-fetch 抓时存）或 extract-excerpt 从正文提取，
// publish/sync 把它同步进 _meta.json；cover 指向 publish 衍生的小尺寸
// 缩略图（卡片只占 160px，不必下正文大图）。
const ArchiveCard = ({ article, onArticleNavigate = null }) => {
  const cover = article.cover
    ? resolveMarkdownAssetUrl(article.cover, resolvePublicContentUrl(article.file))
    : '';
  const preloadArticleAssets = () => {
    preloadMarkdownFile(article.file);
    preloadRouteForPath(article.path);
  };

  return (
    <Link
      to={article.path}
      className="archive-card"
      data-ai-insights-article-path={article.path}
      onMouseEnter={preloadArticleAssets}
      onFocus={preloadArticleAssets}
      onTouchStart={preloadArticleAssets}
      onClick={(event) => onArticleNavigate?.(article, event)}
    >
      {cover && (
        <div className="archive-card-thumb">
          <img src={cover} alt="" />
        </div>
      )}
      <div className="archive-card-body">
        <h3 className="archive-card-title">{article.title}</h3>
        {article.excerpt && (
          <p className="archive-card-excerpt">{article.excerpt}</p>
        )}
      </div>
    </Link>
  );
};

export default ArchiveCard;
