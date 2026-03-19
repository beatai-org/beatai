import React from 'react';
import { HiAnnotation } from 'react-icons/hi';

export default function AnnotationToolbar({
  isAuthenticated,
  position,
  showToolbar,
  onCreateNote
}) {
  if (!showToolbar) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div
        className="annotation-toolbar annotation-toolbar-disabled"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        <span className="annotation-toolbar-message">
          Connect to GitHub to add notes
        </span>
      </div>
    );
  }

  return (
    <div
      className="annotation-toolbar"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <button
        className="annotation-toolbar-btn"
        onClick={onCreateNote}
        title="Add note"
      >
        <HiAnnotation /> Add Note
      </button>
    </div>
  );
}
