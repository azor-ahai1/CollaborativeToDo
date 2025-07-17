import React, { useState, useEffect } from 'react';

const TaskModal = ({ open, onClose, onSave, initial }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [priority, setPriority] = useState(initial?.priority || 1);
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setPriority(initial?.priority || 1);
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted"); 
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (["Todo", "In Progress", "Done"].includes(title.trim())) {
      setError('Title must not match column names');
      return;
    }
    setError('');
    console.log("Calling onSave with", { title: title.trim(), description, priority }); 
    onSave({ title: title.trim(), description, priority });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      overflowY: 'auto'
    }}>
      <form className="task-modal-responsive card" onSubmit={handleSubmit} style={{ minWidth: 320, maxWidth: 400, width: '100%', boxSizing: 'border-box' }}>
        <h3 style={{ marginBottom: 16 }}>{initial ? 'Edit Task' : 'New Task'}</h3>
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: 8 }}>{error}</div>}
        <div style={{ marginBottom: 12 }}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid var(--color-border)', marginTop: 4, fontSize: 15 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid var(--color-border)', marginTop: 4, fontSize: 15 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Priority</label>
          <input
            type="number"
            min={1}
            max={5}
            value={priority}
            onChange={e => setPriority(Number(e.target.value))}
            style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid var(--color-border)', marginTop: 4, fontSize: 15 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button type="button" onClick={onClose} style={{ background: 'var(--color-border)', color: 'var(--color-text)', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>Cancel</button>
          <button type="submit" style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>{initial ? 'Save' : 'Create'}</button>
        </div>
      </form>
      <style>{`
        .task-modal-responsive {
          min-width: 320px;
          max-width: 400px;
          width: 100%;
        }
        @media (max-width: 600px) {
          .task-modal-responsive {
            min-width: 90vw;
            max-width: 98vw;
            padding: 8px;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskModal; 