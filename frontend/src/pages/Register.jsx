import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axios';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/v1/users/register', { username, email, password }, { withCredentials: true });
      if (!res.data.data.accessToken) {
        alert('Registration failed: No token received.');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', res.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      dispatch(login(res.data.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-center" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <form className="register-form-center card" onSubmit={handleSubmit} style={{ minWidth: 320, maxWidth: 400, width: '100%' }}>
        <h2 style={{ marginBottom: 16 }}>Register</h2>
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: 8 }}>{error}</div>}
        <div style={{ marginBottom: 12 }}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid var(--color-border)', marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid var(--color-border)', marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid var(--color-border)', marginTop: 4 }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 10,
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 8
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Login</Link>
        </div>
      </form>
      <style>{`
        .register-form-center {
          min-width: 320px;
          max-width: 400px;
          width: 100%;
        }
        @media (max-width: 600px) {
          .register-form-center {
            min-width: 90vw;
            max-width: 98vw;
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default Register; 