import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnnotationContext } from '../../contexts/AnnotationContext';
import { usePageTitle } from '../../contexts/PageTitleContext';
import AnnotationDialog from './annotationSystem/AnnotationDialog';
import {
  highlightTextInDOM,
  removeHighlightById
} from './annotationSystem/annotationDomUtils';
import AnnotationPopup from './annotationSystem/AnnotationPopup';
import AnnotationToolbar from './annotationSystem/AnnotationToolbar';
import { useAnnotationOverlay } from './annotationSystem/useAnnotationOverlay';
import './AnnotationSystem.css';

const AnnotationSystem = () => {
  const location = useLocation();
  const { pageTitle } = usePageTitle();
  const {
    annotations,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    isAuthenticated,
    loadAnnotationsForPage
  } = useAnnotationContext();
  const [noteContent, setNoteContent] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editingAnnotationId, setEditingAnnotationId] = useState(null);
  const {
    activeAnnotation,
    annotationPopupPosition,
    closeActiveAnnotation,
    closeCreateDialog,
    isCreatingNote,
    selectedRange,
    selectedText,
    setActiveAnnotation,
    setIsCreatingNote,
    setSelectedRange,
    setShowToolbar,
    showToolbar,
    toolbarPosition
  } = useAnnotationOverlay({
    annotations,
    loadAnnotationsForPage,
    pathname: location.pathname
  });

  const handleCloseCreateDialog = () => {
    closeCreateDialog();
    setNoteContent('');
  };

  const handleClosePopup = () => {
    closeActiveAnnotation();
    setIsEditingNote(false);
    setEditingAnnotationId(null);
    setNoteContent('');
  };

  const handleCreateAnnotation = () => {
    if (!noteContent.trim() || !selectedRange) {
      return;
    }

    const currentPath = window.location.pathname;
    const newAnnotation = addAnnotation(selectedText, noteContent, currentPath, pageTitle);

    const docContent = document.querySelector('.doc-content');
    if (docContent) {
      highlightTextInDOM(docContent, newAnnotation);
    }

    handleCloseCreateDialog();
    setShowToolbar(false);
    setSelectedRange(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleDeleteAnnotation = (id) => {
    removeHighlightById(id);

    const currentPath = window.location.pathname;
    deleteAnnotation(id, currentPath);
    closeActiveAnnotation();
    setIsEditingNote(false);
    setEditingAnnotationId(null);
    setNoteContent('');
  };

  const handleEditAnnotation = () => {
    if (!activeAnnotation) {
      return;
    }

    setIsEditingNote(true);
    setEditingAnnotationId(activeAnnotation.id);
    setNoteContent(activeAnnotation.note);
  };

  const handleSaveEdit = () => {
    if (!noteContent.trim() || !editingAnnotationId) {
      return;
    }

    const currentPath = window.location.pathname;
    updateAnnotation(editingAnnotationId, noteContent, currentPath);

    const updatedAnnotation = annotations.find((annotation) => annotation.id === editingAnnotationId);
    if (updatedAnnotation) {
      setActiveAnnotation({ ...updatedAnnotation, note: noteContent });
    }

    setNoteContent('');
    setIsEditingNote(false);
    setEditingAnnotationId(null);
  };

  const handleCancelEdit = () => {
    setIsEditingNote(false);
    setEditingAnnotationId(null);
    setNoteContent('');
  };

  return (
    <>
      <AnnotationToolbar
        isAuthenticated={isAuthenticated}
        position={toolbarPosition}
        showToolbar={showToolbar && !isCreatingNote}
        onCreateNote={() => setIsCreatingNote(true)}
      />

      {isCreatingNote && (
        <AnnotationDialog
          noteContent={noteContent}
          position={toolbarPosition}
          selectedText={selectedText}
          onChange={setNoteContent}
          onClose={handleCloseCreateDialog}
          onSave={handleCreateAnnotation}
        />
      )}

      <AnnotationPopup
        activeAnnotation={activeAnnotation}
        isEditingNote={isEditingNote}
        noteContent={noteContent}
        position={annotationPopupPosition}
        onCancelEdit={handleCancelEdit}
        onChange={setNoteContent}
        onClose={handleClosePopup}
        onDelete={handleDeleteAnnotation}
        onEdit={handleEditAnnotation}
        onSaveEdit={handleSaveEdit}
      />
    </>
  );
};

export default AnnotationSystem;
