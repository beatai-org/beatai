import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { HiAnnotation, HiX, HiPencil } from 'react-icons/hi';
import { useAnnotationContext } from '../../contexts/AnnotationContext';
import './AnnotationSystem.css';

const AnnotationSystem = () => {
  const location = useLocation();
  const {
    annotations,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    isViewingShared,
    loadAnnotationsForPage
  } = useAnnotationContext();
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [selectedRange, setSelectedRange] = useState(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [annotationPopupPosition, setAnnotationPopupPosition] = useState({ x: 0, y: 0 });
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editingAnnotationId, setEditingAnnotationId] = useState(null);
  const annotationsRef = useRef(annotations);

  // Keep ref in sync with annotations
  useEffect(() => {
    annotationsRef.current = annotations;
  }, [annotations]);

  // Load annotations for current page when route changes
  useEffect(() => {
    loadAnnotationsForPage(location.pathname);
  }, [location.pathname, loadAnnotationsForPage]);

  // Apply highlights when annotations change OR when route changes
  // This handles both: initial load and page navigation
  useEffect(() => {
    if (annotations.length > 0) {
      // Wait longer for DocContent to finish rendering
      const timer = setTimeout(() => {
        applyAllHighlights(annotations);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [annotations, location.pathname]);

  useEffect(() => {
    // Handle text selection
    const handleMouseUp = (e) => {
      // Don't show toolbar if clicking on highlighted text
      if (e.target.classList.contains('highlighted-text')) {
        return;
      }

      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text && text.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setSelectedText(text);
        setSelectedRange(range.cloneRange());

        // Position toolbar above the selected text
        // Use fixed positioning relative to viewport
        setToolbarPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10  // 10px above the selection
        });
        setShowToolbar(true);
        setActiveAnnotation(null); // Close any open annotation popup
      } else {
        setShowToolbar(false);
      }
    };

    // Handle clicks on highlighted text
    const handleClick = (e) => {
      if (e.target.classList.contains('highlighted-text')) {
        const annotationId = parseInt(e.target.dataset.annotationId);
        const annotation = annotationsRef.current.find(a => a.id === annotationId);

        if (annotation) {
          const rect = e.target.getBoundingClientRect();
          setAnnotationPopupPosition({
            x: rect.left + rect.width / 2,
            y: rect.bottom + window.scrollY + 10
          });
          setActiveAnnotation(annotation);
          setShowToolbar(false);
        }
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Apply highlights to all annotations on the current page
  const applyAllHighlights = (annotationsToApply) => {
    const docContent = document.querySelector('.doc-content');
    if (!docContent) return;

    // First, remove all existing highlights to avoid duplicates
    const existingHighlights = docContent.querySelectorAll('.highlighted-text');
    existingHighlights.forEach(highlight => {
      const textNode = document.createTextNode(highlight.textContent);
      highlight.parentNode.replaceChild(textNode, highlight);
    });

    // Then apply new highlights
    annotationsToApply.forEach(annotation => {
      highlightTextInDOM(docContent, annotation);
    });
  };

  // Highlight text in the DOM
  const highlightTextInDOM = (container, annotation) => {
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    // eslint-disable-next-line no-cond-assign
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    for (const textNode of textNodes) {
      const text = textNode.textContent;
      const index = text.indexOf(annotation.text);

      if (index !== -1 && !textNode.parentElement.classList.contains('highlighted-text')) {
        const range = document.createRange();
        range.setStart(textNode, index);
        range.setEnd(textNode, index + annotation.text.length);

        const span = document.createElement('span');
        span.className = 'highlighted-text';
        span.dataset.annotationId = annotation.id;
        span.textContent = annotation.text;

        range.deleteContents();
        range.insertNode(span);
        break; // Only highlight first occurrence
      }
    }
  };

  const handleCreateAnnotation = () => {
    if (!noteContent.trim() || !selectedRange) return;

    const currentPath = window.location.pathname;
    const newAnnotation = addAnnotation(selectedText, noteContent, currentPath);

    // Apply highlight to the selected text
    const docContent = document.querySelector('.doc-content');
    if (docContent) {
      highlightTextInDOM(docContent, newAnnotation);
    }

    setNoteContent('');
    setIsCreatingNote(false);
    setShowToolbar(false);
    setSelectedRange(null);

    // Clear selection
    window.getSelection().removeAllRanges();
  };

  const handleDeleteAnnotation = (id) => {
    // Remove highlight from DOM
    const highlightedElements = document.querySelectorAll(`.highlighted-text[data-annotation-id="${id}"]`);
    highlightedElements.forEach(element => {
      const textNode = document.createTextNode(element.textContent);
      element.parentNode.replaceChild(textNode, element);
    });

    const currentPath = window.location.pathname;
    deleteAnnotation(id, currentPath);
    setActiveAnnotation(null);
    setIsEditingNote(false);
  };

  const handleEditAnnotation = () => {
    if (!activeAnnotation) return;
    setIsEditingNote(true);
    setEditingAnnotationId(activeAnnotation.id);
    setNoteContent(activeAnnotation.note);
  };

  const handleSaveEdit = () => {
    if (!noteContent.trim() || !editingAnnotationId) return;

    const currentPath = window.location.pathname;
    updateAnnotation(editingAnnotationId, noteContent, currentPath);

    // Update active annotation
    const updatedAnnotation = annotations.find(a => a.id === editingAnnotationId);
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
      {/* Selection Toolbar */}
      {showToolbar && !isCreatingNote && !isViewingShared && (
        <div
          className="annotation-toolbar"
          style={{
            left: `${toolbarPosition.x}px`,
            top: `${toolbarPosition.y}px`
          }}
        >
          <button
            className="annotation-toolbar-btn"
            onClick={() => setIsCreatingNote(true)}
            title="Add note"
          >
            <HiAnnotation /> Add Note
          </button>
        </div>
      )}

      {/* Note Creation Dialog */}
      {isCreatingNote && (
        <>
          <div
            className="annotation-backdrop"
            onClick={() => {
              setIsCreatingNote(false);
              setNoteContent('');
            }}
          />
          <div
            className="annotation-dialog"
            style={{
              left: `${toolbarPosition.x}px`,
              top: `${toolbarPosition.y + 20}px`
            }}
          >
            <div className="annotation-dialog-header">
              <span>Add Note</span>
              <button
                onClick={() => {
                  setIsCreatingNote(false);
                  setNoteContent('');
                }}
              >
                <HiX />
              </button>
            </div>
            <div className="annotation-dialog-quote">
              "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
            </div>
            <textarea
              className="annotation-dialog-input"
              placeholder="Write your note here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              autoFocus
            />
            <div className="annotation-dialog-actions">
              <button
                className="annotation-btn annotation-btn-cancel"
                onClick={() => {
                  setIsCreatingNote(false);
                  setNoteContent('');
                }}
              >
                Cancel
              </button>
              <button
                className="annotation-btn annotation-btn-primary"
                onClick={handleCreateAnnotation}
              >
                Save Note
              </button>
            </div>
          </div>
        </>
      )}

      {/* Annotation Popup (shown when clicking highlighted text) */}
      {activeAnnotation && (
        <>
          <div
            className="annotation-backdrop"
            onClick={() => {
              setActiveAnnotation(null);
              setIsEditingNote(false);
              setNoteContent('');
            }}
          />
          <div
            className="annotation-popup"
            style={{
              left: `${annotationPopupPosition.x}px`,
              top: `${annotationPopupPosition.y}px`
            }}
          >
            <div className="annotation-popup-header">
              <HiAnnotation /> {isEditingNote ? 'Edit Note' : 'Note'}
              <button
                className="annotation-popup-close"
                onClick={() => {
                  setActiveAnnotation(null);
                  setIsEditingNote(false);
                  setNoteContent('');
                }}
              >
                <HiX />
              </button>
            </div>
            <div className="annotation-popup-quote">
              "{activeAnnotation.text.substring(0, 100)}{activeAnnotation.text.length > 100 ? '...' : ''}"
            </div>

            {isEditingNote ? (
              // Edit mode
              <>
                <textarea
                  className="annotation-dialog-input"
                  placeholder="Write your note here..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  autoFocus
                />
                <div className="annotation-popup-actions">
                  <button
                    className="annotation-btn annotation-btn-cancel"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    className="annotation-btn annotation-btn-primary"
                    onClick={handleSaveEdit}
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              // View mode
              <>
                <div className="annotation-popup-content">
                  {activeAnnotation.note}
                </div>
                {!isViewingShared && (
                  <div className="annotation-popup-actions">
                    <button
                      className="annotation-btn annotation-btn-edit"
                      onClick={handleEditAnnotation}
                    >
                      <HiPencil /> Edit
                    </button>
                    <button
                      className="annotation-btn annotation-btn-delete"
                      onClick={() => handleDeleteAnnotation(activeAnnotation.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

    </>
  );
};

export default AnnotationSystem;
