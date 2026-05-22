import React from 'react';

// 文章末尾的原文出处：左侧竖线样式，原文链接以纯文本展示（非超链接），
// 便于复制全文同步到公众号（公众号正文不支持外链）。
function ArticleSourceCard({ url }) {
  if (!url) {
    return null;
  }

  return (
    <aside className="article-source-card">
      <span className="article-source-card-label">阅读原文</span>
      <span className="article-source-card-url">{url}</span>
    </aside>
  );
}

export default ArticleSourceCard;
