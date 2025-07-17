import React, { useState } from 'react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import ConflictModal from './ConflictModal';

const columns = [
  { key: 'Todo', label: 'Todo' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Done', label: 'Done' },
];

const KanbanBoard = ({ tasks, socket }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [conflict, setConflict] = useState(null);

  const onDragStart = (task) => setDraggedTask(task);
  const onDragEnd = () => setDraggedTask(null);

  const onDrop = (status) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authenticated. Please log in again.');
      return;
    }
    if (draggedTask && draggedTask.status !== status) {
      socket.emit('move-task', { taskId: draggedTask._id, status, token });
    }
    setDraggedTask(null);
  };

  const handleCreate = () => {
    setEditTask(null);
    setShowTaskModal(true);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = (data) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authenticated. Please log in again.');
      return;
    }
    console.log("handleSaveTask called with", data); 
    if (editTask) {
      socket.emit('update-task', { ...data, taskId: editTask._id, clientUpdatedAt: editTask.updatedAt, token }, (res) => {
        console.log("update-task response", res); 
        if (res?.conflict) {
          setConflict({
            ...res.conflict,
            clientTask: { ...editTask, ...data }, 
            serverTask: res.conflict.serverTask   
          });
        } else {
          setShowTaskModal(false);
        }
      });
    } else {
      socket.emit('create-task', { ...data, token }, (res) => {
        console.log("create-task response", res); 
        if (res?.error) alert(res.error);
        else setShowTaskModal(false);
      });
    }
  };

  const handleResolveConflict = (resolution) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authenticated. Please log in again.');
      return;
    }
    socket.emit('resolve-conflict', {
      taskId: conflict.serverTask._id,
      resolution,
      clientTask: conflict.clientTask,
      serverTask: conflict.serverTask,
      token
    }, (res) => {
      setConflict(null);
      setShowTaskModal(false); 
      setEditTask(null);      
    });
  };

  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <h2 style={{ color: 'var(--color-primary)', fontSize: 24, margin: 0 }}>Kanban Board</h2>
        <button
          onClick={handleCreate}
          className="add-task-btn"
          style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 17 }}
        >
          + Add Task
        </button>
      </div>
      <div className="kanban-columns">
        {columns.map(col => (
          <div
            key={col.key}
            className="kanban-column"
            style={{ background: 'var(--color-card)', borderRadius: 8, boxShadow: '0 2px 8px var(--color-shadow)', padding: 8 }}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(col.key)}
          >
            <h3 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: 12, fontSize: 18 }}>{col.label}</h3>
            <div>
              {tasks.filter(t => t.status === col.key).map(task => (
                <div key={task._id} className={`task-wrapper ${draggedTask && draggedTask._id === task._id ? 'dragging' : ''}`} style={{ marginBottom: 12 }}>
                  <TaskCard
                    task={task}
                    socket={socket}
                    onDragStart={() => onDragStart(task)}
                    onDragEnd={onDragEnd}
                    draggable
                    token={localStorage.getItem('token')}
                  />
                  <button
                    onClick={() => handleEdit(task)}
                    className="edit-btn"
                    style={{ background: 'var(--color-border)', color: 'var(--color-text)', border: 'none', borderRadius: 4, padding: '6px 10px', fontWeight: 600, cursor: 'pointer', marginTop: 4, fontSize: 14, width: '100%' }}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <TaskModal
        open={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
        initial={editTask}
      />
      <ConflictModal
        open={!!conflict}
        clientTask={conflict?.clientTask}
        serverTask={conflict?.serverTask}
        onMerge={() => handleResolveConflict('merge')}
        onOverwrite={() => handleResolveConflict('overwrite')}
        onClose={() => setConflict(null)}
      />
      <style>{`
        .kanban-board {
          width: 100%;
        }
        .kanban-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .kanban-columns {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .kanban-column {
          flex: 0 0 320px;
          min-width: 260px;
        }
        .dragging {
          transform: scale(1.04) rotate(-2deg);
          box-shadow: 0 8px 24px var(--color-shadow);
        }
        @media (max-width: 768px) {
          .kanban-header h2 { font-size: 20px; }
          .add-task-btn { padding: 8px 16px; font-size: 15px; }
          .kanban-columns { gap: 12px; }
          .kanban-column { flex: 0 0 280px; min-width: 250px; }
        }
        @media (max-width: 480px) {
          .kanban-header { flex-direction: column; align-items: stretch; }
          .kanban-header h2 { text-align: center; font-size: 18px; }
          .add-task-btn { font-size: 14px; }
          .kanban-columns { flex-direction: column; gap: 8px; overflow-x: unset; }
          .kanban-column { flex: none; min-width: 0; }
        }
      `}</style>
    </div>
  );
};

export default KanbanBoard;