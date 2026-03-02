# Smoke environment contract (CZERTAINLY)

## Required
- BASE_URL: Frontend URL of the environment under test.
- AUTH_MODE: "local" or "oidc".
- SMOKE_USERNAME / SMOKE_PASSWORD: Smoke user credentials.

## Recommended for stable smoke (later)
- DISCOVERY_PROVIDER_NAME: A stable Discovery Provider available in every env.
- DISCOVERY_TARGET: A stable discovery target (preferably an internal TLS test service) injected via env vars.

## Notes
- No environment URLs, credentials, or internal targets must be committed to the repo.
- All sensitive values must be provided via CI/TestKube secrets or local .env (ignored by git).
- The SMK-003 discovery smoke will be skipped when discovery env vars are not provided.