#!/bin/bash
set -e
cd /home/runner/workspace/python-api
echo "Starting FastAPI server on port ${PORT:-8080}..."
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8080}"
