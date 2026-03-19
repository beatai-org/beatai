import React from 'react';
import { HiAnnotation, HiPencil, HiX } from 'react-icons/hi';
import { getAnnotationPreview } from './annotationDomUtils';

export default function AnnotationPopup({
  activeAnnotation,
  isEditingNote,
  noteContent,
  position,
  onCancelEdit,
  onChange,
  onClose,
  onDelete,
  onEdit,
  onSaveEdit
}) {
  if (!activeAnnotation) {
    return null;
  }

  return (
    <>
      <div className="annotation-backdrop" onClick={onClose} />
      <div
        className="annotation-popup"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        <div className="annotation-popup-header">
          <HiAnnotation /> {isEditingNote ? 'Edit Note' : 'Note'}
          <button className="annotation-popup-close" onClick={onClose}>
            <HiX />
          </button>
        </div>
        <div className="annotation-popup-quote">
          {getAnnotationPreview(activeAnnotation.text)}
        </div>

        {isEditingNote ? (
          <>
            <textarea
              className="annotation-dialog-input"
              placeholder="Write your note here..."
              value={noteContent}
              onChange={(event) => onChange(event.target.value)}
              autoFocus
            />
            <div className="annotation-popup-actions">
              <button
                className="annotation-btn annotation-btn-cancel"
                onClick={onCancelEdit}
              >
                Cancel
              </button>
              <button
                className="annotation-btn annotation-btn-primary"
                onClick={onSaveEdit}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="annotation-popup-content">
              {activeAnnotation.note}
            </div>
            <div className="annotation-popup-actions">
              <button
                className="annotation-btn annotation-btn-edit"
                onClick={onEdit}
              >
                <HiPencil /> Edit
              </button>
              <button
                className="annotation-btn annotation-btn-delete"
                onClick={() => onDelete(activeAnnotation.id)}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
