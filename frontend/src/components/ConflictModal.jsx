import React from 'react';

const ConflictModal = ({ open, clientTask, serverTask, onMerge, onOverwrite, onClose }) => {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      overflowY: 'auto'
    }}>
      <div className="card conflict-modal-responsive" style={{ minWidth: 340, maxWidth: 500, width: '100%' }}>
        <h3 style={{ color: 'var(--color-danger)', marginBottom: 16, fontSize: 20 }}>Conflict Detected</h3>
        <p style={{ marginBottom: 16, fontSize: 15 }}>This task was updated by another user. Please choose how to resolve:</p>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <b>Your Version</b>
            <div style={{ fontSize: 13, margin: '8px 0' }}>
              <div><b>Title:</b> {clientTask?.title || ''}</div>
              <div><b>Description:</b> {clientTask?.description || ''}</div>
              <div><b>Priority:</b> {clientTask?.priority || ''}</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <b>Server Version</b>
            <div style={{ fontSize: 13, margin: '8px 0' }}>
              <div><b>Title:</b> {serverTask?.title || ''}</div>
              <div><b>Description:</b> {serverTask?.description || ''}</div>
              <div><b>Priority:</b> {serverTask?.priority || ''}</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button onClick={onMerge} style={{ background: 'var(--color-accent)', color: '#222', border: 'none', borderRadius: 4, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontSize: 15, minWidth: 100 }}>Merge</button>
          <button onClick={onOverwrite} style={{ background: 'var(--color-danger)', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontSize: 15, minWidth: 100 }}>Overwrite</button>
          <button onClick={onClose} style={{ background: 'var(--color-border)', color: 'var(--color-text)', border: 'none', borderRadius: 4, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontSize: 15, minWidth: 100 }}>Cancel</button>
        </div>
      </div>
      <style>{`
        .conflict-modal-responsive {
          min-width: 340px;
          max-width: 500px;
          width: 100%;
        }
        @media (max-width: 600px) {
          .conflict-modal-responsive {
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

export default ConflictModal; 