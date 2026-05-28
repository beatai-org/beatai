import React from 'react';
import ReadingModeToggleButton from './ReadingModeToggleButton';
import ThemeSelector from '../ThemeSelector';
import { useReadingMode } from '../../contexts/ReadingModeContext';

function ReadingModeFloatingActions() {
  const { isReadonlyMode } = useReadingMode();

  return (
    <div className="reading-mode-floating-actions">
      <ThemeSelector />
      {!isReadonlyMode && <ReadingModeToggleButton />}
    </div>
  );
}

export default ReadingModeFloatingActions;
