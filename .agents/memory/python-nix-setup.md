---
name: Python on Replit NixOS
description: How to set up Python correctly in the Replit NixOS environment
---

# Python on Replit NixOS

## Rule
Use `installProgrammingLanguage({ language: "python-3.11" })` via the package-management skill to install Python, then `installLanguagePackages({ language: "python", packages: [...] })` for dependencies. Do NOT call `pip install` in `start.sh` — packages managed by Replit's toolchain are already on PATH.

**Why:** `pip` is not in PATH on NixOS by default. The shell will fail with "pip: command not found" unless the Python module is installed via the skill first. Once the module is installed, packages are globally available and re-installing on every startup wastes time and causes failures.

**How to apply:** After installing the module, write `start.sh` as just `exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8080}"` with no pip install step.
