import React from 'react';
import TableOfContents from './TableOfContents';
import { useReadingMode } from '../../contexts/ReadingModeContext';

function DocArticleLayout({
  articleRef,
  articleClassName = 'doc-content',
  articleKey,
  headings,
  afterArticle = null,
  children
}) {
  const { isReadingMode } = useReadingMode();
  const resolvedArticleClassName = [articleClassName, isReadingMode ? 'reading-mode' : ''].filter(Boolean).join(' ');

  return (
    <>
      <div className="doc-wrapper">
        <article ref={articleRef} className={resolvedArticleClassName} key={articleKey}>
          {children}
        </article>
        {afterArticle ? (
          <div className={`doc-article-after ${isReadingMode ? 'reading-mode' : ''}`}>
            {afterArticle}
          </div>
        ) : null}
      </div>
      {!isReadingMode && <TableOfContents headings={headings} />}
    </>
  );
}

export default DocArticleLayout;
