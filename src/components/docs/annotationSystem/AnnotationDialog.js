import React from 'react';
import { HiX } from 'react-icons/hi';
import { getAnnotationPreview } from './annotationDomUtils';

export default function AnnotationDialog({
  noteContent,
  position,
  selectedText,
  onChange,
  onClose,
  onSave
}) {
  return (
    <>
      <div className="annotation-backdrop" onClick={onClose} />
      <div
        className="annotation-dialog"
        style={{
          left: `${position.x}px`,
          top: `${position.y + 20}px`
        }}
      >
        <div className="annotation-dialog-header">
          <span>Add Note</span>
          <button onClick={onClose}>
            <HiX />
          </button>
        </div>
        <div className="annotation-dialog-quote">
          {getAnnotationPreview(selectedText)}
        </div>
        <textarea
          className="annotation-dialog-input"
          placeholder="Write your note here..."
          value={noteContent}
          onChange={(event) => onChange(event.target.value)}
          autoFocus
        />
        <div className="annotation-dialog-actions">
          <button
            className="annotation-btn annotation-btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="annotation-btn annotation-btn-primary"
            onClick={onSave}
          >
            Save Note
          </button>
        </div>
      </div>
    </>
  );
}
