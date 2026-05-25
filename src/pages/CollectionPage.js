import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LearnClaudeCodeIcon from '../components/icons/LearnClaudeCodeIcon';
import PageShell from '../components/layout/PageShell';
import PageSeo from '../components/seo/PageSeo';
import { ReadingModeProvider } from '../contexts/ReadingModeContext';
import { useReadingModeSearchParam } from '../hooks/useReadingModeSearchParam';
import { getBookDefaultUrl, getBooksOfCollection } from '../content';
import { preloadRouteForPath } from '../utils/routePrefetch';
import './AITutorials.css';

export default function CollectionPage({ collection }) {
  const [hoveredId, setHoveredId] = useState('');
  const readingMode = useReadingModeSearchParam();
  const { isReadingMode } = readingMode;
  const books = useMemo(() => getBooksOfCollection(collection), [collection]);

  const renderCardIcon = (book) => {
    if (book.id === 'learn-claude-code') {
      return <LearnClaudeCodeIcon size={88} animated={hoveredId === book.id} />;
    }
    return (
      <div className="ai-tutorial-card-icon-text" aria-hidden="true">
        DL
      </div>
    );
  };

  const preloadBookRoute = (book) => {
    preloadRouteForPath(getBookDefaultUrl(book));
  };

  return (
    <ReadingModeProvider value={readingMode}>
      <>
        <PageSeo title={collection.title} description={collection.description} />

        <PageShell
          rootClassName={`ai-tutorials-page ${isReadingMode ? 'reading-mode' : ''}`.trim()}
          hideHeader={isReadingMode}
          showReadingModeToggle
        >
          <div className="ai-tutorials-container">
            <section className="ai-tutorials-grid" aria-label={`${collection.title} books`}>
              {books.map((book) => (
                <Link
                  key={book.id}
                  to={getBookDefaultUrl(book)}
                  className="ai-tutorial-card glass-card"
                  onMouseEnter={() => {
                    setHoveredId(book.id);
                    preloadBookRoute(book);
                  }}
                  onFocus={() => preloadBookRoute(book)}
                  onTouchStart={() => preloadBookRoute(book)}
                  onMouseLeave={() => setHoveredId('')}
                >
                  <div className="ai-tutorial-card-spotlight" aria-hidden="true"></div>
                  <div className="ai-tutorial-card-icon">
                    {renderCardIcon(book)}
                  </div>
                  <div className="ai-tutorial-card-body">
                    <span className="ai-tutorial-card-badge">{book.cardLabel || '已上线'}</span>
                    <h2>{book.bookTitle}</h2>
                    <p>{book.description}</p>
                  </div>
                  <div className="ai-tutorial-card-footer">
                    <span>{book.cardMeta || '进入教程'}</span>
                    <span className="ai-tutorial-card-arrow">{book.cardCta || '进入阅读'}</span>
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
