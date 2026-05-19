import React, { useEffect, useRef, useState } from 'react';
import { HiSparkles, HiOutlineMenuAlt2 } from 'react-icons/hi';
import HiddenTipsModal from './HiddenTipsModal';
import ReadingModeToggleButton from './ReadingModeToggleButton';
import ReadingModeToc from './ReadingModeToc';

function ReadingModeFloatingActions() {
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const tocPopoverRef = useRef(null);
  const tocButtonRef = useRef(null);

  useEffect(() => {
    if (!showToc) return undefined;

    const handlePointer = (event) => {
      if (
        tocPopoverRef.current?.contains(event.target) ||
        tocButtonRef.current?.contains(event.target)
      ) {
        return;
      }
      setShowToc(false);
    };

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setShowToc(false);
      }
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showToc]);

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
        <button
          ref={tocButtonRef}
          type="button"
          className="reading-mode-toggle-btn reading-mode-toc-btn"
          onClick={() => setShowToc((v) => !v)}
          aria-label="打开目录"
          aria-expanded={showToc}
          title="目录"
        >
          <HiOutlineMenuAlt2 />
        </button>
        <ReadingModeToggleButton />
      </div>
      {showToc && (
        <div
          className="reading-mode-toc-popover"
          ref={tocPopoverRef}
          role="dialog"
          aria-label="文章目录"
        >
          <ReadingModeToc />
        </div>
      )}
      <HiddenTipsModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
      />
    </>
  );
}

export default ReadingModeFloatingActions;
