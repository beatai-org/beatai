import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HiX, HiClipboard, HiCheckCircle, HiExternalLink } from 'react-icons/hi';
import { useAnnotationContext } from '../../contexts/AnnotationContext';
import './ShareAnnotationsDialog.css';

const ShareAnnotationsDialog = ({ isOpen, onClose }) => {
  const { gistId } = useAnnotationContext();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}${window.location.pathname}?annotations=${gistId}`;
  const gistUrl = `https://gist.github.com/${gistId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setCopied(false);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="share-dialog-backdrop" onClick={handleClose}>
      <div className="share-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="share-dialog-header">
          <h2>Share Your Annotations</h2>
          <button className="share-dialog-close" onClick={handleClose}>
            <HiX />
          </button>
        </div>

        <div className="share-dialog-content">
          <p className="share-dialog-intro">
            Anyone with this link can view your annotations on this documentation page:
          </p>

          <div className="share-dialog-url-container">
            <input
              type="text"
              className="share-dialog-url-input"
              value={shareUrl}
              readOnly
            />
            <button
              className={`share-dialog-copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <HiCheckCircle />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <HiClipboard />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="share-dialog-gist-link">
            <p>You can also view all your annotations on GitHub:</p>
            <a
              href={gistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="share-dialog-external-link"
            >
              <HiExternalLink />
              View Gist on GitHub
            </a>
          </div>

          <div className="share-dialog-warning">
            <div className="share-dialog-warning-icon">⚠️</div>
            <div>
              <strong>Note:</strong> Your annotations are publicly visible. Anyone with
              the link can view them. Please don't include sensitive information in your
              notes.
            </div>
          </div>

          <div className="share-dialog-tip">
            <div className="share-dialog-tip-icon">💡</div>
            <div>
              <strong>Tip:</strong> Share this link with colleagues to help them
              understand the documentation better with your insights!
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ShareAnnotationsDialog;
