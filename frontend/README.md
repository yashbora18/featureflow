# Feature Flag Management System - Frontend

## Overview

The frontend is built using React and provides a modern dashboard for managing feature flags, environments, targeting rules, analytics, audit logs, and system settings. It communicates with the FastAPI backend through REST APIs.

---

# Technologies Used

- React
- Vite
- React Router
- Axios
- React Icons
- React i18next
- React Toastify
- CSS3

---

# Project Structure

```
frontend/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── locales/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
│
└── README.md
```

---

# Installation

Clone the repository.

```bash
git clone <repository-url>
```

Move to the frontend folder.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

---

# Run the Application

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Features

- User Authentication
- Dashboard Overview
- Feature Flag Management
- Environment Management
- Targeting Rules
- User & Group Targeting
- Percentage Rollout
- Analytics Dashboard
- Audit Logs
- Environment Switching
- Dark / Light Theme
- Multi-language Support
- Responsive UI

---

# Supported Languages

- English
- Hindi
- Marathi
- Gujarati
- Bengali
- Tamil
- Telugu
- Kannada
- Malayalam
- Punjabi
- Odia
- Assamese
- Urdu

---

# Folder Overview

- **components/** – Reusable UI components
- **pages/** – Application pages
- **services/** – API calls
- **locales/** – Translation JSON files
- **assets/** – Images and icons

---

# Backend Connection

Update the API base URL if required:

```
src/services/api.js
```

Example:

```javascript
http://127.0.0.1:8000
```

---

# Author

Developed as part of the Infosys Springboard Virtual Internship Feature Flag Management System project.