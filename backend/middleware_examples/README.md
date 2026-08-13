# Middleware Integration Examples

This folder demonstrates how the Feature Flag API can be integrated into external applications with minimal setup.

---

## FastAPI Example

Location:

```
fastapi_demo/
```

Files:

- main.py
- middleware.py

Run:

```bash
uvicorn main:app --reload
```

The application checks feature flags before serving responses.

Example:

- chatbot
- new_dashboard

---

## Django Example

Location:

```
django_demo/
```

Files:

- middleware.py
- views.py

The Django application calls the Feature Flag API before rendering responses.

Example:

- chatbot
- new_dashboard

---

## Feature Flag API

Both examples communicate with the Feature Flag backend.

Example endpoint:

```
POST http://127.0.0.1:8000/evaluate
```

Example request:

```json
{
  "flag_key": "chatbot",
  "environment": "Development",
  "user_id": "user123"
}
```

Example response:

```json
{
  "enabled": true
}
```

---

## Benefits

- Minimal integration effort
- Framework independent
- Supports FastAPI and Django
- Centralized feature management
- Dynamic feature evaluation