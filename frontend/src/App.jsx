import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components';
import { Login, Register, Dashboard, Profile } from './pages';
import { useSelector } from 'react-redux';
import { selectUserAuth } from './store/authSlice';

function App() {
  const userAuth = useSelector(selectUserAuth);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Header />
      <main style={{ paddingTop: 32 }}>
        <Routes>
          <Route path="/login" element={userAuth ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={userAuth ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={userAuth ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={userAuth ? <Profile /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={userAuth ? "/dashboard" : "/login"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 