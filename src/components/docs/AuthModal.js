import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HiX, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { useAuthContext } from '../../contexts/AuthContext';
import { SITE_CONFIG } from '../../utils/siteConfig';
import './AuthModal.css';

const GITHUB_TOKEN_URL = `https://github.com/settings/tokens/new?description=${encodeURIComponent(`${SITE_CONFIG.brandName} Login`)}`;

const AuthModal = ({ isOpen, onClose }) => {
  const { login } = useAuthContext();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(token);

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setToken('');
        setSuccess(false);
      }, 1500);
    } else {
      setError(result.error || '连接失败，请检查你的 Token 是否正确。');
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

  return ReactDOM.createPortal(
    <div className="auth-modal-backdrop" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>连接 GitHub</h2>
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
              <h3>连接成功！</h3>
            </div>
          ) : (
            <>
              <div className="auth-modal-intro">
                <div className="auth-modal-github-logo">
                  <svg height="32" viewBox="0 0 16 16" width="32" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </div>

                <h3>连接 GitHub 账号</h3>
                <ul className="auth-modal-benefits">
                  <li>
                    <strong>身份标识：</strong> 在站点中显示你的 GitHub 头像与用户名
                  </li>
                  <li>
                    <strong>多端一致：</strong> 在不同设备和浏览器中保持登录状态
                  </li>
                </ul>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="auth-modal-form-group">
                  <label htmlFor="token">个人访问令牌（PAT）</label>
                  <input
                    id="token"
                    type="password"
                    className="auth-modal-input"
                    placeholder="请输入 GitHub Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <div className="auth-modal-hint">
                    该 Token 仅用于读取你的账号信息，无需勾选任何权限。
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
                    href={GITHUB_TOKEN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="auth-modal-help-link"
                  >
                    🔗 30秒快速生成 Token
                  </a>
                  <div className="auth-modal-help-steps">
                    <ol>
                      <li>点击上方链接打开 GitHub</li>
                      <li>无需勾选任何权限</li>
                      <li>点击页面底部的“Generate token”</li>
                      <li>复制生成的 Token 并粘贴到上方输入框</li>
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
                    稍后再说
                  </button>
                  <button
                    type="submit"
                    className="auth-modal-btn auth-modal-btn-primary"
                    disabled={isLoading || !token}
                  >
                    {isLoading ? '连接中...' : '连接 GitHub'}
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
