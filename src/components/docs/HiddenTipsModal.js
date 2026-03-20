import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { HiAnnotation, HiLightningBolt, HiX } from 'react-icons/hi';
import './HiddenTipsModal.css';

const shortcuts = [
  { keys: ['CMD', 'UP'], description: '快速回到当前章节顶部' },
  { keys: ['CMD', 'DOWN'], description: '快速滚动到评论区开始位置' },
  { keys: ['CMD', 'LEFT'], description: '访问上一章节' },
  { keys: ['CMD', 'RIGHT'], description: '访问下一章节' }
];

const noteSteps = [
  '在章节正文中选中一段文字。',
  '等待高亮操作浮层出现，然后点击添加笔记。',
  '输入你的想法或勘误说明并保存。',
  '之后可以在右上角个人菜单里的 My Notes 查看所有笔记。'
];

function HiddenTipsModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
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
            <div className="hidden-tips-eyebrow">BeatAI Hidden Tips</div>
            <h2 id="hidden-tips-title">隐藏技巧</h2>
          </div>
          <button
            type="button"
            className="hidden-tips-close"
            onClick={onClose}
            aria-label="关闭隐藏技巧"
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

          <section className="hidden-tips-section">
            <div className="hidden-tips-section-title">
              <HiAnnotation />
              <span>如何添加笔记</span>
            </div>
            <ol className="hidden-tips-notes">
              {noteSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="hidden-tips-note">
              提示：如果当前页面没有出现添加笔记的交互，请先确认你选中的是正文内容，而不是代码块或评论区 iframe。
            </p>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default HiddenTipsModal;
