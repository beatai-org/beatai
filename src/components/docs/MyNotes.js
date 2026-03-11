import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiAnnotation, HiArrowLeft } from 'react-icons/hi';
import { useAnnotationContext } from '../../contexts/AnnotationContext';
import AppHeader from '../AppHeader/AppHeader';
import './MyNotes.css';

const MyNotes = () => {
  const { allAnnotations, isAuthenticated } = useAnnotationContext();
  const navigate = useNavigate();

  // Get all annotations sorted by time (newest first)
  const sortedAnnotations = useMemo(() => {
    const all = Object.values(allAnnotations).flat();
    return all.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeB - timeA; // Descending order
    });
  }, [allAnnotations]);

  if (!isAuthenticated) {
    return (
      <div className="my-notes-page">
        <AppHeader />
        <div className="my-notes-container">
          <div className="my-notes-empty">
            <HiAnnotation />
            <h2>Please Connect to GitHub</h2>
            <p>You need to connect your GitHub account to view your notes.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-notes-page">
      <AppHeader />
      <div className="my-notes-container">
      <div className="my-notes-header">
        <button className="my-notes-back-btn" onClick={() => navigate(-1)}>
          <HiArrowLeft />
        </button>
        <div className="my-notes-title">
          <HiAnnotation />
          <h1>My Notes</h1>
          <span className="my-notes-count">{sortedAnnotations.length}</span>
        </div>
      </div>

      {sortedAnnotations.length > 0 ? (
        <div className="my-notes-list">
          {sortedAnnotations.map((annotation) => (
            <div
              key={annotation.id}
              className="my-notes-item"
              onClick={() => navigate(annotation.path)}
            >
              <div className="my-notes-item-header">
                <span className="my-notes-item-page">
                  {annotation.pageTitle || annotation.path.split('/').pop() || 'Untitled'}
                </span>
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
      ) : (
        <div className="my-notes-empty">
          <HiAnnotation />
          <h2>No Notes Yet</h2>
          <p>Start highlighting text and adding notes to build your collection.</p>
        </div>
      )}
    </div>
  </div>
  );
};

export default MyNotes;
