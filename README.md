# AI Capsule

AI Capsule is a full-stack web application for storing and managing useful AI prompts. 
Users authenticate using GitHub OAuth and can create, view, update and delete their own 
prompt records.

The application consists of a React frontend, an Express/Node.js backend, SQLite 
database storage, GitHub OAuth authentication and JWT-based application authentication.

---

## 1. Features

The application provides the following required functionality:

- GitHub OAuth login
- JWT-based application authentication
- Secure HttpOnly authentication cookie
- Protected dashboard
- Create AI prompt records
- Read/view saved prompt records
- Update existing prompt records
- Delete prompt records
- User-specific prompt ownership
- Public health-check endpoint
- Cloud deployment using Render
- SQLite database storage
- Protected API routes

---

## 2. Technology Stack

### Frontend
- React
- JavaScript
- Vite

### Backend
- Node.js
- Express.js
- Passport.js
- GitHub OAuth
- JSON Web Token (JWT)
- CORS
- Cookie Parser

### Database
- SQLite

### Deployment
- Render

---

## 3. Application Structure

The project is organised into frontend and backend components.

```text
AI-Capsule/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   └── ...
│   └── ...
│
├── server/
│   ├── database/
│   │   └── database.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── capsules.js
│   ├── githubAuth.js
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .env
├── package.json
└── README.md
