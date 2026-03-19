import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiAnnotation, HiArrowLeft } from 'react-icons/hi';
import { useAnnotationContext } from '../../contexts/AnnotationContext';
import { TabGroup } from '../common';
import PageShell from '../layout/PageShell';
import MyNotesEmptyState from './MyNotesEmptyState';
import { useCategoryNavigation } from '../../hooks/useCategoryNavigation';
import { useDocsMeta } from '../../hooks/useDocsMeta';
import { loadBookTitles, getBookTitle } from '../../utils/bookTitles';
import {
  buildBookGroups,
  formatAnnotationDate,
  getFilteredPageGroups,
  getTotalAnnotationCount
} from './myNotesUtils';
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
  const bookGroups = useMemo(() => buildBookGroups(allAnnotations), [allAnnotations]);
  const filteredPageGroups = useMemo(
    () => getFilteredPageGroups(bookGroups, activeBook),
    [bookGroups, activeBook]
  );
  const totalCount = useMemo(() => getTotalAnnotationCount(bookGroups), [bookGroups]);

  if (!isAuthenticated) {
    return (
      <PageShell
        rootClassName="my-notes-page"
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
      >
        <div className="my-notes-container">
          <MyNotesEmptyState
            title="Please Connect to GitHub"
            description="You need to connect your GitHub account to view your notes."
          />
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
                        <span className="my-notes-item-date">{formatAnnotationDate(annotation.createdAt)}</span>
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
          <MyNotesEmptyState
            title="No Notes Yet"
            description="Start highlighting text and adding notes to build your collection."
          />
        )}
      </div>
    </PageShell>
  );
};

export default MyNotes;
