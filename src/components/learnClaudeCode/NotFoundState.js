import React from 'react';
import { useLocation } from 'react-router-dom';
import { getBookBasePath } from '../../content';

const LCC_BOOK_ID = 'learn-claude-code';
const LEGACY_LEARN_CLAUDE_CODE_BASE_PATH = '/learn-claude-code';

export function NotFoundState({ label }) {
  return (
    <div className="doc-error">
      <h1>Page not found</h1>
      <p>{label}</p>
    </div>
  );
}

export function LearnRouteNotFound() {
  const location = useLocation();
  const lccBase = getBookBasePath(LCC_BOOK_ID);
  const label = location.pathname
    .replace(`${lccBase}/`, '')
    .replace(`${LEGACY_LEARN_CLAUDE_CODE_BASE_PATH}/`, '') || location.pathname;

  return <NotFoundState label={label} />;
}
