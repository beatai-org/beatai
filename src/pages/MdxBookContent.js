import React from 'react';
import LearnClaudeCode from './LearnClaudeCode';

// Today the only mdx book is Learn Claude Code, so this thin wrapper delegates
// to <LearnClaudeCode />. When a real MDX runtime lands, replace the body here
// with the generic MDX renderer; no caller needs to change.
function MdxBookContent({ book }) {
  return <LearnClaudeCode book={book} />;
}

export default MdxBookContent;
