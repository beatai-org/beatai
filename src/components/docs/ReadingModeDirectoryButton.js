import React from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';

function ReadingModeDirectoryButton({ onClick }) {
  return (
    <button
      type="button"
      className="reading-mode-toggle-btn reading-mode-directory-toggle"
      onClick={onClick}
      aria-label="打开当前目录"
      title="当前目录"
    >
      <HiMenuAlt2 />
    </button>
  );
}

export default ReadingModeDirectoryButton;
