# Memory Index

- [Feature Flag System architecture](feature-flag-arch.md) — FastAPI+Postgres backend / React+Vite frontend, env-context file split for HMR, evaluate-engine ambiguity handling, Orval `useQueryOptions` gotcha.
- [Orval null query params](orval-null-params.md) — generated client serializes `null` query params as literal `"null"`; always pass `param ?? undefined`.
- [Python on Nix setup](python-nix-setup.md) — don't `pip install` in start scripts; use `installProgrammingLanguage` + `installLanguagePackages` first.
