import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import PageSeo from '../components/seo/PageSeo';
import { getBookDefaultUrl, getBooksOfCollection } from '../content';
import { preloadRouteForPath } from '../utils/routePrefetch';
import './AITutorials.css';

export default function CollectionPage({ collection }) {
  const books = useMemo(() => getBooksOfCollection(collection), [collection]);

  const preloadBookRoute = (book) => {
    preloadRouteForPath(getBookDefaultUrl(book));
  };

  return (
    <>
      <PageSeo title={collection.title} description={collection.description} />

      <PageShell rootClassName="ai-tutorials-page">
        <div className="ai-tutorials-container">
          <section className="ai-tutorials-grid" aria-label={`${collection.title} books`}>
            {books.map((book) => (
              <Link
                key={book.id}
                to={getBookDefaultUrl(book)}
                className="ai-tutorial-card glass-card"
                onMouseEnter={() => preloadBookRoute(book)}
                onFocus={() => preloadBookRoute(book)}
                onTouchStart={() => preloadBookRoute(book)}
              >
                <h2>{book.bookTitle}</h2>
                <p>{book.description}</p>
              </Link>
            ))}
          </section>
        </div>
      </PageShell>
    </>
  );
}
