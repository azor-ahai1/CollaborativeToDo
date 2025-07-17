import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser, selectUserAuth } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toggleTheme, getTheme } from '../utils/theme';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const userAuth = useSelector(selectUserAuth);
  const [theme, setTheme] = React.useState(getTheme());

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/dashboard" className="logo">
            To-Do Board
          </Link>
          
          <div className="header-actions">
            <button
              onClick={handleThemeToggle}
              className="theme-toggle"
              title="Toggle dark/light mode"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            
            {userAuth ? (
              <div className="user-section">
                <span className="username">{user?.username}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-link">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <style>{`
        .header {
          width: 100%;
          background: var(--color-card);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-container {
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .logo {
          color: var(--color-primary);
          font-weight: 700;
          font-size: 1.5rem;
          text-decoration: none;
          flex-shrink: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }

        .theme-toggle {
          background: none;
          border: none;
          color: var(--color-primary);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .username {
          color: var(--color-text);
          font-weight: 500;
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
        }

        .logout-btn {
          background: var(--color-danger);
          color: white;
          border: none;
          border-radius: 0.375rem;
          padding: 0.5rem 1rem;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.875rem;
          white-space: nowrap;
        }

        .login-link {
          color: var(--color-primary);
          text-decoration: underline;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.5rem;
          border-radius: 0.375rem;
        }

        @media (max-width: 768px) {
          .header-container { padding: 0.5rem 0.75rem; }
          .logo { font-size: 1.25rem; }
          .header-actions { gap: 0.5rem; }
          .username { max-width: 100px; font-size: 0.875rem; }
          .logout-btn { padding: 0.375rem 0.75rem; font-size: 0.8rem; }
        }

        @media (max-width: 480px) {
          .header-container { padding: 0.5rem; gap: 0.5rem; }
          .logo { font-size: 1.125rem; }
          .header-actions { gap: 0.375rem; }
          .user-section { gap: 0.5rem; }
          .username { max-width: 80px; font-size: 0.8rem; }
          .logout-btn { padding: 0.25rem 0.625rem; font-size: 0.75rem; }
          .login-link { font-size: 0.875rem; padding: 0.25rem 0.5rem; }
          .theme-toggle { font-size: 1rem; padding: 0.25rem; }
        }

        @media (max-width: 320px) {
          .header-container { flex-direction: column; align-items: stretch; text-align: center; }
          .logo { margin-bottom: 0.25rem; }
          .header-actions { justify-content: center; }
          .username { max-width: 60px; }
        }
      `}</style>
    </>
  );
};

export default Header;