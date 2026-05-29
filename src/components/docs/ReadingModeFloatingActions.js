import React from 'react';
import ReadingModeToggleButton from './ReadingModeToggleButton';
import ReadingModeDirectoryButton from './ReadingModeDirectoryButton';
import ThemeSelector from '../ThemeSelector';
import { useReadingMode } from '../../contexts/ReadingModeContext';

function ReadingModeFloatingActions({ onDirectoryOpen = null }) {
  const { isReadonlyMode } = useReadingMode();

  return (
    <div className="reading-mode-floating-actions">
      {onDirectoryOpen && <ReadingModeDirectoryButton onClick={onDirectoryOpen} />}
      <ThemeSelector />
      {!isReadonlyMode && <ReadingModeToggleButton />}
    </div>
  );
}

export default ReadingModeFloatingActions;
