import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiAnnotation, HiArrowLeft } from 'react-icons/hi';
import { useAnnotationContext } from '../../contexts/AnnotationContext';
import AppHeader from '../AppHeader/AppHeader';
import Footer from '../Footer/Footer';
import { TabGroup } from '../common';
import { loadBookTitles, getBookTitle } from '../../utils/bookTitles';
import './MyNotes.css';

const MyNotes = () => {
  const { allAnnotations, isAuthenticated } = useAnnotationContext();
  const navigate = useNavigate();
  const [activeBook, setActiveBook] = useState('all');
  const [bookTitlesLoaded, setBookTitlesLoaded] = useState(false);
  const [meta, setMeta] = useState(null);

  // Load book titles on mount
  useEffect(() => {
    loadBookTitles().then(() => {
      setBookTitlesLoaded(true);
    });
  }, []);

  // Load meta for AppHeader categories
  useEffect(() => {
    const metaPath = `${process.env.PUBLIC_URL}/docs/_meta.json`;
    fetch(metaPath)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setMeta(data);
      })
      .catch(err => console.error('Failed to load docs meta:', err));
  }, []);

  const handleCategoryClick = (category) => {
    // Navigate to the first item in the first section of this category
    const firstSection = category.sections?.[0];
    const firstItem = firstSection?.items?.[0];

    if (firstItem?.path) {
      navigate(firstItem.path);
    }
  };

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
      <div className="my-notes-page dynamic-background">
        {/* Background Layer */}
        <div className="sailor-moon-bg-layer"></div>

        <AppHeader
          categories={categories}
          activeCategory={null}
          onCategoryClick={handleCategoryClick}
        />
        <div className="my-notes-container">
          <div className="my-notes-empty">
            <HiAnnotation />
            <h2>Please Connect to GitHub</h2>
            <p>You need to connect your GitHub account to view your notes.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="my-notes-page dynamic-background">
      {/* Background Layer */}
      <div className="sailor-moon-bg-layer"></div>

      <AppHeader
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
      />
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
    <Footer />
  </div>
  );
};

export default MyNotes;
