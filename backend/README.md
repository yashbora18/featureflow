# Feature Flag Management System - Backend

## Overview

The Feature Flag Management System backend provides APIs for managing feature flags, environments, targeting rules, evaluation, audit logging, analytics, and caching. It is built with FastAPI, PostgreSQL, SQLAlchemy, and Redis.

---

# Technologies Used

- FastAPI
- PostgreSQL
- SQLAlchemy
- Redis
- Pydantic
- Uvicorn
- Pytest

---

# Project Structure

```
backend/
│
├── app/
│   ├── core/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   └── main.py
│
├── tests/
│
├── middleware_examples/
│
├── requirements.txt
│
└── README.md
```

---

# Installation

Clone the repository.

```bash
git clone <repository-url>
```

Move to the backend folder.

```bash
cd backend
```

Create a virtual environment.

```bash
python -m venv venv
```

Activate the virtual environment.

Windows

```bash
venv\Scripts\activate
```

Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

---

# Database

Start PostgreSQL.

Create the project database.

Update the database configuration inside:

```
app/core/database.py
```

Apply database migrations (if applicable).

---

# Redis

Start Redis server before running the application.

Default Redis configuration:

```
localhost:6379
```

---

# Run the Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

# Main Features

- Authentication
- Feature Flag CRUD
- Environment Management
- Targeting Rules
- User Targeting
- Group Targeting
- Percentage Rollout
- Environment Overrides
- Evaluation Engine
- Redis Caching
- Audit Logs
- Analytics
- Middleware Integration Examples

---

# Middleware Examples

Example integrations are available in:

```
middleware_examples/
```

Included examples:

- FastAPI
- Django

---

# Running Tests

Execute all tests.

```bash
pytest
```

Execute a specific test.

```bash
pytest tests/test_evaluation.py
```

---

# API Modules

- Flags
- Environments
- Evaluation
- Targeting Rules
- Audit Logs
- Analytics

---

# Author

Developed as part of the Infosys Springboard Virtual Internship Feature Flag Management System project.