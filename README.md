# To-Do Kanban Board

## Project Overview
A real-time collaborative Kanban board for task management. Users can create, edit, move, assign, and delete tasks, with live updates across all clients. Includes smart assignment of tasks and robust conflict handling for concurrent edits.

## Tech Stack
- **Frontend:** React, Redux Toolkit, Socket.IO Client, CSS (responsive design)
- **Backend:** Node.js, Express, Socket.IO, MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)

## Setup & Installation

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud instance)

### 1. Clone the Repository
```bash
git clone https://github.com/azor-ahai1/CollaborativeToDo.git
cd ToDo
```

### 2. Backend Setup
```bash
cd backend
npm install
```

#### Create a `.env` file in the `backend` directory:
```
PORT=
MONGODB_URI=
DB_NAME=
CORS_ORIGIN=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
NODE_ENV=
FRONTEND_URL=
```

#### Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

#### Create a `.env` file in the `frontend` directory:
```
VITE_API_BASE_URL=
```

#### Start the frontend dev server:
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## Features & Usage Guide

- **User Registration & Login:** Secure JWT-based authentication.
- **Kanban Board:** Drag-and-drop tasks between columns (Todo, In Progress, Done).
- **Task CRUD:** Create, edit, and delete tasks. Edit opens a modal with pre-filled details.
- **Real-Time Collaboration:** All changes are broadcast live to all connected users via Socket.IO.
- **Smart Assign:** Assigns a task to the user with the fewest active (non-done) tasks.
- **Activity Log:** See a real-time log of all actions (create, move, edit, delete, assign).
- **Conflict Handling:** If two users edit the same task at once, a conflict modal appears, allowing you to merge or overwrite changes.
- **Responsive UI:** Works on desktop, tablet, and mobile.
- **Dark/Light Mode:** Toggle theme from the header.

### Usage Guide
1. Register or log in.
2. Add tasks using the "+ Add Task" button.
3. Drag tasks between columns to update their status.
4. Edit or delete tasks using the buttons on each task card.
5. Use "Smart Assign" to automatically assign a task to the least busy user.
6. View all recent actions in the Activity Log panel.
7. If a conflict occurs during editing, resolve it using the modal.

## Smart Assign Logic
- When you click "Smart Assign" on a task, the backend:
  1. Counts the number of active (not Done) tasks assigned to each user.
  2. Assigns the task to the user with the fewest active tasks.
  3. Updates the board and logs the action.

## Conflict Handling Logic
- When you edit a task, the backend checks if the task was updated by someone else since you loaded it.
- If a conflict is detected:
  1. A modal appears showing your attempted changes and the latest server version.
  2. You can choose to **Merge** (apply only your changed fields) or **Overwrite** (replace the server version with yours).
  3. The backend updates the task accordingly and broadcasts the update to all users.


---

For any issues or contributions, please open an issue or pull request on the repository. 