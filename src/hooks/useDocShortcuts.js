import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function isEditableTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const editableSelector = [
    'input',
    'textarea',
    'select',
    '[contenteditable="true"]',
    '.playground-textarea',
    '.search-input',
    '.docsearch-input'
  ].join(', ');

  return Boolean(target.closest(editableSelector));
}

function hasSelection() {
  if (typeof window === 'undefined' || !window.getSelection) {
    return false;
  }

  const selection = window.getSelection();
  return Boolean(selection && String(selection).trim());
}

export function useDocShortcuts({
  articleRef = null,
  commentsRef = null,
  prev = null,
  next = null,
  enabled = true
} = {}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (!event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return;
      }

      if (isEditableTarget(event.target) || hasSelection()) {
        return;
      }

      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();

        if (articleRef?.current instanceof HTMLElement) {
          articleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        return;
      }

      if (event.key === 'ArrowDown') {
        if (!(commentsRef?.current instanceof HTMLElement)) {
          return;
        }

        event.preventDefault();
        commentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (event.key === 'ArrowLeft') {
        if (!prev?.path) {
          return;
        }

        event.preventDefault();
        navigate(prev.path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (event.key === 'ArrowRight') {
        if (!next?.path) {
          return;
        }

        event.preventDefault();
        navigate(next.path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [articleRef, commentsRef, enabled, navigate, next, prev]);
}
