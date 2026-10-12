# Team Task Manager

A full-stack workspace for assigning team tasks, sharing assignment materials, and tracking progress. Admins can manage work across the team, while each member sees the tasks and assignments assigned to them.

## Features

- Create assignments and tasks, and assign them to team members.
- Link tasks to assignments and track task status: **To do**, **Halfway**, or **Completed**.
- Add optional images and documents to tasks and assignments.
- View and download shared images and documents.
- Invite users and manage admin access.
- Keep task, assignment, and presence updates in sync in real time.
- Show progress summaries for completed and pending tasks.

## Screenshots

### Dashboard

![Taskora dashboard](https://raw.githubusercontent.com/Nitul-D/Taskora-Team-Project-Assignment-Manager-Frontend-/main/docs/Screenshots/dashboard.png)

### Admin panel

![Admin panel with team and progress summaries](https://raw.githubusercontent.com/Nitul-D/Taskora-Team-Project-Assignment-Manager-Frontend-/main/docs/Screenshots/adminpanel.png)

### Assignments

![Create an assignment and attach files](https://raw.githubusercontent.com/Nitul-D/Taskora-Team-Project-Assignment-Manager-Frontend-/main/docs/Screenshots/assignmentcreate.png)

### Tasks

![Task management section](https://raw.githubusercontent.com/Nitul-D/Taskora-Team-Project-Assignment-Manager-Frontend-/main/docs/Screenshots/tasksection.png)

### User management

![Manage team members and admin access](https://raw.githubusercontent.com/Nitul-D/Taskora-Team-Project-Assignment-Manager-Frontend-/main/docs/Screenshots/manageusers.png)

### Roles and access

- **Team members** see only the tasks and assignments assigned to them. They can update the status of their own tasks.
- **Admins** can see all tasks and assignments, create work, and edit records.
- **Primary admin** has full control. Other admins cannot delete primary-admin work or change its assignee.

## Tech stack

```
1 - Frontend | React, TypeScript, Vite, Tailwind CSS
2 - Backend | Node.js, Express
3 - Database | MongoDB with Mongoose
4 - Authentication | Clerk
5 - File storage | Cloudinary
6 - Real-time updates | Socket.IO
7 - Client state | Zustand
```

## Project structure

```
1 - backend/
       1 - controller/   - API handlers
       2 - lib/          - Database, admin, uploads, realtime helpers
       3 - middleware/   - Authentication and access checks
       4 - models/       - MongoDB models
       5 - routes/       - API routes

2 - frontend/
        1 - components/   - Shared UI and forms
        2 - layout/       - Main application layout
        3 - pages/        - Application screens
        4 - providers/    - Authentication and app-wide providers
        5 - stores/       - Zustand state and API actions
```

## Requirements

- Node.js and npm
- A MongoDB database
- A Clerk application
- A Cloudinary account for image and document uploads

## Run locally

### 1. Configure the backend

Create `backend/.env`:

```dotenv
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
ADMIN_EMAIL=the_primary_admin_email
FRONTEND_URL=frontend_url
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 2. Configure the frontend

Create `frontend/.env`:

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=your_vite_api_url
```
