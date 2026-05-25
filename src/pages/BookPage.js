import React from 'react';
import MarkdownBookContent from './MarkdownBookContent';
import MdxBookContent from './MdxBookContent';

// Single entry point for rendering any book. Dispatches by contentKind:
//
//   'markdown' → <MarkdownBookContent />  (DocsLayout + DocContent pipeline)
//   'mdx'      → <MdxBookContent />        (LearnClaudeCode pipeline today;
//                                           generic MDX renderer in the future)
function BookPage({ book }) {
  if (!book) {
    return null;
  }
  if (book.contentKind === 'mdx') {
    return <MdxBookContent book={book} />;
  }
  return <MarkdownBookContent book={book} />;
}

export default BookPage;
