import React from 'react';
import MarkdownBookContent from './MarkdownBookContent';

// Single entry point for rendering any book. Every book is now a tree of
// .md articles plus a `_meta.json`; per-article tabs and embedded components
// are declared in the meta item (see public/docs/llc-content/_meta.json).
function BookPage({ book }) {
  if (!book) {
    return null;
  }
  return <MarkdownBookContent book={book} />;
}

export default BookPage;
