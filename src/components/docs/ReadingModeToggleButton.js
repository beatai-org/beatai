import React from 'react';
import { HiArrowsExpand, HiX } from 'react-icons/hi';
import { Tooltip } from '../common';
import { useReadingMode } from '../../contexts/ReadingModeContext';

function ReadingModeToggleButton({ className = '' }) {
  const { isReadingMode, toggleReadingMode } = useReadingMode();
  const tooltipText = isReadingMode ? '退出阅读模式' : '进入阅读模式';

  return (
    <Tooltip content={tooltipText}>
      <button
        type="button"
        className={`reading-mode-toggle-btn ${className}`.trim()}
        onClick={toggleReadingMode}
        aria-pressed={isReadingMode}
        aria-label={tooltipText}
        title={tooltipText}
      >
        {isReadingMode ? <HiX /> : <HiArrowsExpand />}
      </button>
    </Tooltip>
  );
}

export default ReadingModeToggleButton;
