# 🗂️ Trelloop

Trelloop is a full-stack, Project management application that helps teams organize work into workspaces, boards, lists, and cards. It supports real-time collaboration, comments, deadline reminders, notifications, and role-based workspace access.

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-Express%205-339933?logo=nodedotjs&logoColor=white" alt="Node.js + Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socketdotio&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white" alt="Clerk" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>


## ✨ Features

- **Workspaces, Boards, Lists, Cards** – Organize projects in a Kanban-style structure.
- **Real-time updates** – Live syncing for boards, workspaces, and comments using Socket.IO.
- **Card comments and activity** – Discuss tasks directly inside cards.
- **Deadline reminders** – Automatic reminders for cards due soon.
- **Notifications** – In-app notifications for invites, activity, and reminders.
- **Starred boards** – Pin important boards for quicker access.
- **Authentication** – Secure user auth with Clerk.

## 🛠️ Tech Stack

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- Socket.IO
- Clerk SDK
- node-cron
- Svix (webhook verification)

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- React Icons
- Day.js

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ recommended
- MongoDB instance (local or Atlas)
- A Clerk account for authentication and webhook secrets

### 1️⃣ Clone the repository

```bash
git clone https://github.com/aditya-shrawat/Trelloop.git
cd Trelloop
```

### 2️⃣ Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MongoDB_URL=your_mongodb_connection_string
Frontend_URL=http://localhost:5173
CLERK_WEBHOOK_SECRET_KEY=your_clerk_webhook_secret
```

Run the backend:

```bash
npm run dev
```

The backend will run on http://localhost:4000 by default.

### 3️⃣ Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_BackendURL=http://localhost:4000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Run the frontend:

```bash
npm run dev
```

The app will be available at http://localhost:5173.

## 📜 Scripts

### Backend

| Script | Description |
| --- | --- |
| `npm run dev` | Start the backend with nodemon |
| `npm start` | Start the backend normally |

### Frontend

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## 🤝 Contributing

Contributions are welcome. If you want to make a major change, please open an issue first so the idea can be discussed clearly.

