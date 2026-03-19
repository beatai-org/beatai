import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiAnnotation, HiArrowLeft } from 'react-icons/hi';
import { useAnnotationContext } from '../../contexts/AnnotationContext';
import { TabGroup } from '../common';
import PageShell from '../layout/PageShell';
import { useCategoryNavigation } from '../../hooks/useCategoryNavigation';
import { useDocsMeta } from '../../hooks/useDocsMeta';
import { loadBookTitles, getBookTitle } from '../../utils/bookTitles';
import './MyNotes.css';

const MyNotes = () => {
  const { allAnnotations, isAuthenticated } = useAnnotationContext();
  const navigate = useNavigate();
  const handleCategoryClick = useCategoryNavigation();
  const [activeBook, setActiveBook] = useState('all');
  const { meta } = useDocsMeta();

  // Load book titles on mount
  useEffect(() => {
    loadBookTitles();
  }, []);

  const categories = meta?.categories || [];

  // Group annotations by book and pageTitle
  const bookGroups = useMemo(() => {
    const all = Object.values(allAnnotations).flat();

    // First, group by book
    const byBook = all.reduce((acc, annotation) => {
      const pathParts = annotation.path.split('/').filter(p => p);
      const bookName = pathParts[0] || 'Uncategorized';

      if (!acc[bookName]) {
        acc[bookName] = [];
      }
      acc[bookName].push(annotation);
      return acc;
    }, {});

    // Then, within each book, group by pageTitle
    const result = Object.entries(byBook).map(([bookName, annotations]) => {
      const pageGroups = annotations.reduce((acc, annotation) => {
        const title = annotation.pageTitle || annotation.path.split('/').pop() || 'Untitled';

        if (!acc[title]) {
          acc[title] = {
            title,
            path: annotation.path,
            annotations: []
          };
        }
        acc[title].annotations.push(annotation);
        return acc;
      }, {});

      // Sort annotations within each page by time (newest first)
      const sortedPageGroups = Object.values(pageGroups).map(group => ({
        ...group,
        annotations: group.annotations.sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return timeB - timeA;
        })
      }));

      // Sort page groups by newest annotation
      sortedPageGroups.sort((a, b) => {
        const timeA = new Date(a.annotations[0].createdAt).getTime();
        const timeB = new Date(b.annotations[0].createdAt).getTime();
        return timeB - timeA;
      });

      return {
        bookName,
        pageGroups: sortedPageGroups,
        totalCount: annotations.length,
        newestTime: Math.max(...annotations.map(a => new Date(a.createdAt).getTime()))
      };
    });

    // Sort books by newest annotation
    return result.sort((a, b) => b.newestTime - a.newestTime);
  }, [allAnnotations]);

  // Get filtered page groups based on active book
  const filteredPageGroups = useMemo(() => {
    if (activeBook === 'all') {
      // Combine all page groups from all books
      return bookGroups.flatMap(book =>
        book.pageGroups.map(group => ({
          ...group,
          bookName: book.bookName
        }))
      ).sort((a, b) => {
        const timeA = new Date(a.annotations[0].createdAt).getTime();
        const timeB = new Date(b.annotations[0].createdAt).getTime();
        return timeB - timeA;
      });
    }

    const selectedBook = bookGroups.find(b => b.bookName === activeBook);
    return selectedBook ? selectedBook.pageGroups.map(group => ({
      ...group,
      bookName: selectedBook.bookName
    })) : [];
  }, [bookGroups, activeBook]);

  // Total count of all annotations
  const totalCount = useMemo(() => {
    return bookGroups.reduce((sum, book) => sum + book.totalCount, 0);
  }, [bookGroups]);

  if (!isAuthenticated) {
    return (
      <PageShell
        rootClassName="my-notes-page"
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
      >
        <div className="my-notes-container">
          <div className="my-notes-empty">
            <HiAnnotation />
            <h2>Please Connect to GitHub</h2>
            <p>You need to connect your GitHub account to view your notes.</p>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      rootClassName="my-notes-page"
      categories={categories}
      activeCategory={null}
      onCategoryClick={handleCategoryClick}
    >
      <div className="my-notes-container">
        <div className="my-notes-header">
          <button className="my-notes-back-btn" onClick={() => navigate(-1)}>
            <HiArrowLeft />
          </button>
          <div className="my-notes-title">
            <HiAnnotation />
            <h1>My Notes</h1>
            <span className="my-notes-count">{totalCount}</span>
          </div>
        </div>

        {/* Book Tabs */}
        {bookGroups.length > 0 && (
          <TabGroup
            tabs={[
              {
                id: 'all',
                label: 'All Books',
                count: totalCount
              },
              ...bookGroups.map((book) => ({
                id: book.bookName,
                label: getBookTitle(book.bookName),
                count: book.totalCount
              }))
            ]}
            activeTab={activeBook}
            onChange={setActiveBook}
          />
        )}

        {filteredPageGroups.length > 0 ? (
          <div className="my-notes-groups">
            {filteredPageGroups.map((group) => (
              <div key={`${group.bookName}-${group.title}`} className="my-notes-group">
                <div className="my-notes-group-header">
                  <h2 className="my-notes-group-title">
                    {activeBook === 'all' && group.bookName && (
                      <span className="my-notes-group-book">{getBookTitle(group.bookName)}</span>
                    )}
                    {group.title}
                  </h2>
                  <span className="my-notes-group-count">{group.annotations.length}</span>
                </div>
                <div className="my-notes-list">
                  {group.annotations.map((annotation) => (
                    <div
                      key={annotation.id}
                      className="my-notes-item"
                      onClick={() => navigate(`${annotation.path}#annotation-${annotation.id}`)}
                    >
                      <div className="my-notes-item-header">
                        <span className="my-notes-item-date">
                          {new Date(annotation.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="my-notes-item-quote">
                        "{annotation.text}"
                      </div>
                      <div className="my-notes-item-content">
                        {annotation.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="my-notes-empty">
            <HiAnnotation />
            <h2>No Notes Yet</h2>
            <p>Start highlighting text and adding notes to build your collection.</p>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default MyNotes;
