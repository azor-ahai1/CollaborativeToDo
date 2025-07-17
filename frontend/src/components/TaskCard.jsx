import React from 'react';

const TaskCard = ({ task, socket, onDragStart, onDragEnd, draggable, token }) => {
  const handleDelete = () => {
    if (window.confirm('Delete this task?')) {
      socket.emit('delete-task', { taskId: task._id, token });
    }
  };

  const handleSmartAssign = () => {
    socket.emit('smart-assign', { taskId: task._id, token });
  };

  return (
    <div
      className="card task-card-responsive"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ marginBottom: 12, cursor: draggable ? 'grab' : 'default', position: 'relative', padding: 12 }}
    >
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{task.title}</div>
      <div style={{ fontSize: 13, color: 'var(--color-text)', marginBottom: 6 }}>{task.description}</div>
      <div style={{ fontSize: 12, color: 'var(--color-accent)', marginBottom: 6 }}>
        Assigned: {task.assignedTo ? task.assignedTo.username : 'Unassigned'}
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-primary)', marginBottom: 6 }}>Priority: {task.priority}</div>
      <div className="task-card-btns-responsive" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={handleSmartAssign}
          style={{ background: 'var(--color-accent)', color: '#222', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 14, flex: 1 }}
          title="Smart Assign"
        >
          Smart Assign
        </button>
        <button
          onClick={handleDelete}
          style={{ background: 'var(--color-danger)', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 14, flex: 1 }}
          title="Delete"
        >
          Delete
        </button>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .task-card-responsive {
            padding: 8px !important;
          }
          .task-card-btns-responsive {
            flex-direction: column;
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskCard; 