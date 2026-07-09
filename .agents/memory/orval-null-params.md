---
name: Orval null query params
description: Orval-generated client serializes null as literal "null" string in query params
---

# Orval null query params

## Rule
In Orval-generated clients, `null` values in params objects are serialized as the string `"null"` (not omitted). FastAPI's `Optional[int]` validation rejects `"null"` as a string with a 422 error.

**Why:** The generated URL builder does: `value === null ? 'null' : String(value)`. This means intentional nulls (e.g. "all environments" state) become invalid query strings.

**How to apply:** In every caller that passes optional filter params, convert null to undefined: `environment_id: selectedEnvironmentId ?? undefined`. The generated client skips `undefined` values entirely.
