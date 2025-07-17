import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';

const Profile = () => {
  const user = useSelector(selectUser);

  if (!user) return <div style={{ padding: 32 }}>Not logged in.</div>;

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', background: 'var(--color-card)', borderRadius: 8, boxShadow: '0 2px 8px var(--color-shadow)', padding: 32 }}>
      <h2 style={{ color: 'var(--color-primary)', marginBottom: 16 }}>Profile</h2>
      <div style={{ marginBottom: 12 }}><b>Username:</b> {user.username}</div>
      <div style={{ marginBottom: 12 }}><b>Email:</b> {user.email}</div>
    </div>
  );
};

export default Profile; 