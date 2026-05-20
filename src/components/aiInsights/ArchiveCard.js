import React from 'react';
import { Link } from 'react-router-dom';
import { resolveMarkdownAssetUrl, resolvePublicContentUrl } from '../../utils/markdown';

// /ai-insights 列表卡片：展示数据全部来自 _meta.json 的 article 条目
// （title / summary / cover / path / file）。刻意不 fetch 文章 .md 原文——
// 列表页有几十张卡片，逐篇拉 md 太重。summary 由 material-pipeline 的
// extract-summary 写入、publish/sync 同步进 _meta.json；cover 指向 publish
// 衍生的小尺寸缩略图（卡片只占 160px，不必下正文大图）。
const ArchiveCard = ({ article }) => {
  const cover = article.cover
    ? resolveMarkdownAssetUrl(article.cover, resolvePublicContentUrl(article.file))
    : '';

  return (
    <Link
      to={{ pathname: article.path, search: '?mode=read' }}
      className="archive-card"
    >
      {cover && (
        <div className="archive-card-thumb">
          <img src={cover} alt="" loading="lazy" />
        </div>
      )}
      <div className="archive-card-body">
        <h3 className="archive-card-title">{article.title}</h3>
        {article.summary && (
          <p className="archive-card-excerpt">{article.summary}</p>
        )}
      </div>
    </Link>
  );
};

export default ArchiveCard;
