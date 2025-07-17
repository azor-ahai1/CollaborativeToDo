import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, selectTasks } from '../store/taskSlice';
import { setActions, selectActions } from '../store/actionLogSlice';
import KanbanBoard from '../components/KanbanBoard';
import ActivityLogPanel from '../components/ActivityLogPanel';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const token = localStorage.getItem('token');
const socket = io(import.meta.env.VITE_API_BASE_URL, {
  withCredentials: true,
  auth: { token },
});

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector(selectTasks);
  const actions = useSelector(selectActions);

  React.useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    socket.emit('board:request');
    socket.emit('actions:request');
    socket.on('board:update', (tasks) => {
      dispatch(setTasks(tasks));
    });
    socket.on('actions:update', (actions) => {
      dispatch(setActions(actions));
    });
    return () => {
      socket.off('board:update');
      socket.off('actions:update');
    };
  }, [dispatch, navigate]);

  return (
    <div className="dashboard">
      <div className="kanban-section">
        <KanbanBoard tasks={tasks} socket={socket} token={token} />
      </div>
      <div className="activity-section">
        <ActivityLogPanel actions={actions} socket={socket} token={token} />
      </div>
      <style>{`
        .dashboard {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg);
        }
        .kanban-section {
          flex: 3;
          padding: 2rem 1rem 2rem 2rem;
        }
        .activity-section {
          flex: 1;
          border-left: 1px solid var(--color-border);
          background: var(--color-card);
          min-width: 320px;
          max-width: 400px;
          padding: 2rem 1rem;
        }
        @media (max-width: 768px) {
          .dashboard { flex-direction: column; min-height: unset; }
          .kanban-section { padding: 1rem 0.5rem; }
          .activity-section { 
            border-left: none; 
            border-top: 1px solid var(--color-border); 
            max-width: 100%; 
            min-width: 0; 
            padding: 1rem 0.5rem; 
          }
        }
        @media (max-width: 480px) {
          .kanban-section { padding: 0.5rem 0.25rem; }
          .activity-section { padding: 0.5rem 0.25rem; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;