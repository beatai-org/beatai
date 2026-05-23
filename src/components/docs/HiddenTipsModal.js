import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { HiLightningBolt, HiX } from 'react-icons/hi';
import { SITE_CONFIG } from '../../utils/siteConfig';
import './HiddenTipsModal.css';

const shortcuts = [
  { keys: ['CMD', 'UP'], description: '快速回到当前章节顶部' },
  { keys: ['CMD', 'DOWN'], description: '快速滚动到评论区开始位置' },
  { keys: ['CMD', 'LEFT'], description: '访问上一章节' },
  { keys: ['CMD', 'RIGHT'], description: '访问下一章节' }
];

function HiddenTipsModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="hidden-tips-backdrop" onClick={onClose}>
      <div
        className="hidden-tips-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hidden-tips-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="hidden-tips-header">
          <div>
            <div className="hidden-tips-eyebrow">{SITE_CONFIG.brandName} Hidden Tips</div>
            <h2 id="hidden-tips-title">阅读技巧</h2>
          </div>
          <button
            type="button"
            className="hidden-tips-close"
            onClick={onClose}
            aria-label="关闭阅读技巧"
          >
            <HiX />
          </button>
        </div>

        <div className="hidden-tips-content">
          <section className="hidden-tips-section">
            <div className="hidden-tips-section-title">
              <HiLightningBolt />
              <span>阅读快捷键</span>
            </div>
            <div className="hidden-tips-shortcuts">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.keys.join('-')} className="hidden-tips-shortcut">
                  <div className="hidden-tips-shortcut-keys" aria-label={shortcut.keys.join(' + ')}>
                    {shortcut.keys.map((key) => (
                      <kbd key={key}>{key}</kbd>
                    ))}
                  </div>
                  <p>{shortcut.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default HiddenTipsModal;
