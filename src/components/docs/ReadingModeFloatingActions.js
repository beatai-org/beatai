import React, { useState } from 'react';
import { HiSparkles } from 'react-icons/hi';
import HiddenTipsModal from './HiddenTipsModal';
import ReadingModeToggleButton from './ReadingModeToggleButton';

function ReadingModeFloatingActions() {
  const [showTipsModal, setShowTipsModal] = useState(false);

  return (
    <>
      <div className="reading-mode-floating-actions">
        <button
          type="button"
          className="reading-mode-toggle-btn reading-mode-tips-btn"
          onClick={() => setShowTipsModal(true)}
          aria-label="打开阅读技巧"
          title="阅读技巧"
        >
          <HiSparkles />
        </button>
        <ReadingModeToggleButton />
      </div>
      <HiddenTipsModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
      />
    </>
  );
}

export default ReadingModeFloatingActions;
