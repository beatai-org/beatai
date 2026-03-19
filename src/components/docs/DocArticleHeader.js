import React from 'react';

function DocArticleHeader({ title, meta = null }) {
  return (
    <header className="doc-article-header">
      <h1 className="doc-h1">{title}</h1>
      {meta}
    </header>
  );
}

export default DocArticleHeader;
