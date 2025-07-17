import React from 'react';

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString();
};

const ActivityLogPanel = ({ actions }) => {
  return (
    <div className="activity-log-panel">
      <h3 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: 16, fontSize: 20 }}>Activity Log</h3>
      <div className="activity-log-content">
        {actions && actions.length > 0 ? actions.map((a, i) => (
          <div key={a._id || i} className="activity-log-item" style={{ borderBottom: '1px solid var(--color-border)', padding: '8px 0' }}>
            <div style={{ fontSize: 13, color: 'var(--color-text)' }}>
              <b>{a.user?.username || 'Unknown'}</b> {renderAction(a)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-accent)' }}>{formatTime(a.createdAt)}</div>
          </div>
        )) : <div style={{ color: 'var(--color-text)', textAlign: 'center' }}>No recent activity.</div>}
      </div>
      <style>{`
        .activity-log-panel {
          background: var(--color-card);
          border-radius: 8px;
          box-shadow: 0 2px 8px var(--color-shadow);
          padding: 1rem;
        }
        .activity-log-content {
          max-height: 600px;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .activity-log-panel { padding: 0.75rem; }
          .activity-log-panel h3 { font-size: 18px; }
        }
        @media (max-width: 480px) {
          .activity-log-panel { padding: 0.5rem; }
          .activity-log-panel h3 { font-size: 16px; }
          .activity-log-item { padding: 6px 0; font-size: 12px; }
        }
      `}</style>
    </div>
  );
};

function renderAction(a) {
  if (a.action === 'move' && a.details?.from && a.details?.to) {
    return (
      <>
        moved <b>{a.task?.title || ''}</b> from <b>{a.details.from}</b> to <b>{a.details.to}</b>
      </>
    );
  }
  if (a.action === 'create') {
    return <>
      created <b>{a.task?.title || a.details?.title || ''}</b>
    </>;
  }
  if (a.action === 'delete') {
    return <>
      deleted <b>{a.details?.title || a.task?.title || ''}</b>
    </>;
  }
  if (a.action === 'smart-assign') {
    return <>
      smart-assigned <b>{a.task?.title || ''}</b> to <b>{a.details?.assignedTo || ''}</b>
    </>;
  }
  return <>{a.action} <b>{a.task?.title || ''}</b></>;
}

export default ActivityLogPanel;