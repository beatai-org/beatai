import { useEffect, useRef, useState } from 'react';
import {
  applyAllHighlights,
  getAnnotationPopupPosition,
  getSelectionToolbarPosition,
  isHighlightedElement,
  scrollToAnnotation
} from './annotationDomUtils';

const HIGHLIGHT_APPLY_DELAY = 200;

export function useAnnotationOverlay({ annotations, loadAnnotationsForPage, pathname }) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [selectedRange, setSelectedRange] = useState(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [annotationPopupPosition, setAnnotationPopupPosition] = useState({ x: 0, y: 0 });
  const annotationsRef = useRef(annotations);

  useEffect(() => {
    annotationsRef.current = annotations;
  }, [annotations]);

  useEffect(() => {
    loadAnnotationsForPage(pathname);
  }, [loadAnnotationsForPage, pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      applyAllHighlights(annotations);

      const hash = window.location.hash;
      if (hash.startsWith('#annotation-')) {
        scrollToAnnotation(hash.replace('#annotation-', ''));
      }
    }, HIGHLIGHT_APPLY_DELAY);

    return () => clearTimeout(timer);
  }, [annotations, pathname]);

  useEffect(() => {
    const handleMouseUp = (event) => {
      if (isHighlightedElement(event.target)) {
        return;
      }

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setShowToolbar(false);
        return;
      }

      const text = selection.toString().trim();

      if (!text) {
        setShowToolbar(false);
        return;
      }

      const range = selection.getRangeAt(0);
      setSelectedText(text);
      setSelectedRange(range.cloneRange());
      setToolbarPosition(getSelectionToolbarPosition(range));
      setShowToolbar(true);
      setActiveAnnotation(null);
    };

    const handleClick = (event) => {
      if (!isHighlightedElement(event.target)) {
        return;
      }

      const annotationId = parseInt(event.target.dataset.annotationId, 10);
      const annotation = annotationsRef.current.find((item) => item.id === annotationId);

      if (!annotation) {
        return;
      }

      setAnnotationPopupPosition(getAnnotationPopupPosition(event.target));
      setActiveAnnotation(annotation);
      setShowToolbar(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const closeCreateDialog = () => {
    setIsCreatingNote(false);
  };

  const closeActiveAnnotation = () => {
    setActiveAnnotation(null);
  };

  return {
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
  };
}
