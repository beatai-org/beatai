import React from 'react';
import { HiArrowsExpand, HiX } from 'react-icons/hi';
import { useReadingMode } from '../../contexts/ReadingModeContext';
import './ReadingModeToggleButton.css';

function ReadingModeToggleButton({ className = '' }) {
  const { isReadingMode, toggleReadingMode } = useReadingMode();

  return (
    <button
      type="button"
      className={`reading-mode-toggle-btn ${className}`.trim()}
      onClick={toggleReadingMode}
      aria-pressed={isReadingMode}
      aria-label={isReadingMode ? 'Exit reading mode' : 'Enter reading mode'}
      title={isReadingMode ? 'Exit reading mode' : 'Enter reading mode'}
    >
      {isReadingMode ? <HiX /> : <HiArrowsExpand />}
    </button>
  );
}

export default ReadingModeToggleButton;
