import React from 'react';
import TableOfContents from './TableOfContents';

function DocArticleLayout({
  articleRef,
  articleClassName = 'doc-content',
  articleKey,
  headings,
  afterArticle = null,
  children
}) {
  return (
    <>
      <div className="doc-wrapper">
        <article ref={articleRef} className={articleClassName} key={articleKey}>
          {children}
        </article>
        {afterArticle}
      </div>
      <TableOfContents headings={headings} />
    </>
  );
}

export default DocArticleLayout;
