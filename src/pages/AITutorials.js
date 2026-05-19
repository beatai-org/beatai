import React, { useCallback, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import LearnClaudeCodeIcon from '../components/icons/LearnClaudeCodeIcon';
import PageShell from '../components/layout/PageShell';
import { ReadingModeProvider } from '../contexts/ReadingModeContext';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useDocsMeta } from '../hooks/useDocsMeta';
import { getLearnAiDefaultPath } from '../utils/learnAiPaths';
import { LEARN_AI_SPACES } from '../utils/learnAiSpaces';
import { buildKnowledgeSpaces, getAiTutorialSpace } from '../utils/knowledgeSpaces';
import './AITutorials.css';

const READING_MODE_PARAM = 'mode';
const READING_MODE_VALUE = 'read';

function AITutorialsContent({ categories, spaces }) {
  const handleCategoryClick = useCategoryNavigation();
  const [hoveredSlug, setHoveredSlug] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const isReadingMode = searchParams.get(READING_MODE_PARAM) === READING_MODE_VALUE;
  const activeSpace = useMemo(() => getAiTutorialSpace(), []);

  const setIsReadingMode = useCallback((next) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      const currentValue = params.get(READING_MODE_PARAM) === READING_MODE_VALUE;
      const resolved = typeof next === 'function' ? next(currentValue) : next;
      if (resolved) {
        params.set(READING_MODE_PARAM, READING_MODE_VALUE);
      } else {
        params.delete(READING_MODE_PARAM);
      }
      return params;
    });
  }, [setSearchParams]);

  const readingModeValue = useMemo(() => ({
    isReadingMode,
    setReadingMode: setIsReadingMode,
    toggleReadingMode: () => setIsReadingMode((current) => !current)
  }), [isReadingMode, setIsReadingMode]);

  const renderCardIcon = (space) => {
    if (space.slug === 'learn-claude-code') {
      return <LearnClaudeCodeIcon size={88} animated={hoveredSlug === space.slug} />;
    }

    return (
      <div className="ai-tutorial-card-icon-text" aria-hidden="true">
        DL
      </div>
    );
  };

  return (
    <ReadingModeProvider value={readingModeValue}>
      <>
        <Helmet>
          <title>AI学习教程 | BeatAI</title>
          <meta
            name="description"
            content="集中浏览 BeatAI 收录的 AI学习教程，目前包含 Learn Claude Code，可直达书籍正文。"
          />
        </Helmet>

        <PageShell
          rootClassName={`ai-tutorials-page ${isReadingMode ? 'reading-mode' : ''}`.trim()}
          spaces={spaces}
          activeSpace={activeSpace}
          onSpaceClick={handleCategoryClick}
          categories={categories}
          activeCategory={null}
          onCategoryClick={handleCategoryClick}
          hideHeader={isReadingMode}
          showReadingModeToggle
        >
          <div className="ai-tutorials-container">
            <section className="ai-tutorials-grid" aria-label="AI tutorial books">
              {LEARN_AI_SPACES.map((space) => (
                <Link
                  key={space.slug}
                  to={getLearnAiDefaultPath(space.slug)}
                  className="ai-tutorial-card glass-card"
                  onMouseEnter={() => setHoveredSlug(space.slug)}
                  onMouseLeave={() => setHoveredSlug('')}
                >
                  <div className="ai-tutorial-card-spotlight" aria-hidden="true"></div>
                  <div className="ai-tutorial-card-icon">
                    {renderCardIcon(space)}
                  </div>
                  <div className="ai-tutorial-card-body">
                    <span className="ai-tutorial-card-badge">{space.cardLabel || '已上线'}</span>
                    <h2>{space.bookTitle}</h2>
                    <p>{space.description}</p>
                  </div>
                  <div className="ai-tutorial-card-footer">
                    <span>{space.cardMeta || '进入教程'}</span>
                    <span className="ai-tutorial-card-arrow">{space.cardCta || '进入阅读'}</span>
                  </div>
                </Link>
              ))}
            </section>
          </div>
        </PageShell>
      </>
    </ReadingModeProvider>
  );
}

export default function AITutorials() {
  const { meta, loading, error } = useDocsMeta();

  if (loading) {
    return <div className="ai-tutorials-status">Loading...</div>;
  }

  if (error || !meta) {
    return <div className="ai-tutorials-status">Failed to load tutorials</div>;
  }

  return (
    <AITutorialsContent
      categories={meta.categories || []}
      spaces={buildKnowledgeSpaces(meta)}
    />
  );
}
