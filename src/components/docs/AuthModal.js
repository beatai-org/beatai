import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HiX, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { useAnnotationContext } from '../../contexts/AnnotationContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const { login } = useAnnotationContext();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [migrated, setMigrated] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(token);

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      setMigrated(result.migrated);
      setTimeout(() => {
        onClose();
        setToken('');
        setSuccess(false);
        setMigrated(false);
      }, 2000);
    } else {
      setError(result.error || 'Failed to connect. Please check your token.');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setToken('');
      setError('');
      setSuccess(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="auth-modal-backdrop" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>Connect to GitHub</h2>
          <button
            className="auth-modal-close"
            onClick={handleClose}
            disabled={isLoading}
          >
            <HiX />
          </button>
        </div>

        <div className="auth-modal-content">
          {success ? (
            <div className="auth-modal-success">
              <HiCheckCircle className="auth-modal-success-icon" />
              <h3>Successfully Connected!</h3>
              {migrated && (
                <p>Your local annotations have been synced to GitHub.</p>
              )}
            </div>
          ) : (
            <>
              <div className="auth-modal-intro">
                <div className="auth-modal-github-logo">
                  <svg height="32" viewBox="0 0 16 16" width="32" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </div>

                <h3>Why Connect GitHub?</h3>
                <ul className="auth-modal-benefits">
                  <li>
                    <strong>Secure Storage:</strong> Annotations saved to your GitHub account
                  </li>
                  <li>
                    <strong>Cross-Device Sync:</strong> Access from any device or browser
                  </li>
                  <li>
                    <strong>Share Notes:</strong> Generate links to share with others
                  </li>
                </ul>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="auth-modal-form-group">
                  <label htmlFor="token">Personal Access Token (PAT)</label>
                  <input
                    id="token"
                    type="password"
                    className="auth-modal-input"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <div className="auth-modal-hint">
                    The token only needs <code>gist</code> scope permission.
                  </div>
                </div>

                {error && (
                  <div className="auth-modal-error">
                    <HiExclamationCircle />
                    <span>{error}</span>
                  </div>
                )}

                <div className="auth-modal-help">
                  <a
                    href="https://github.com/settings/tokens/new?description=BeatAI%20Annotations&scopes=gist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="auth-modal-help-link"
                  >
                    🔗 How to create a token?
                  </a>
                  <div className="auth-modal-help-steps">
                    <ol>
                      <li>Click the link above to open GitHub</li>
                      <li>Ensure <strong>gist</strong> scope is checked</li>
                      <li>Click "Generate token" at the bottom</li>
                      <li>Copy the token and paste it above</li>
                    </ol>
                  </div>
                </div>

                <div className="auth-modal-actions">
                  <button
                    type="button"
                    className="auth-modal-btn auth-modal-btn-secondary"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    Maybe Later
                  </button>
                  <button
                    type="submit"
                    className="auth-modal-btn auth-modal-btn-primary"
                    disabled={isLoading || !token}
                  >
                    {isLoading ? 'Connecting...' : 'Connect GitHub'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
