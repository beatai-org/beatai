import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { NotFoundState } from '../components/learnClaudeCode/NotFoundState';
import { getLearnAiSpace } from '../utils/learnAiSpaces';
import LearnAiDocsBook from './LearnAiDocsBook';
import LearnClaudeCode from './LearnClaudeCode';

function LearnAiBook() {
  const { space: spaceSlug } = useParams();
  const location = useLocation();
  const currentSpace = getLearnAiSpace(spaceSlug);

  if (!currentSpace) {
    return <NotFoundState label={spaceSlug || location.pathname} />;
  }

  if (currentSpace.contentSource === 'docs') {
    return <LearnAiDocsBook />;
  }

  return <LearnClaudeCode />;
}

export default LearnAiBook;
