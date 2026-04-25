# Step 07 — Contact form: Python Lambda + frontend integration

> Paste this entire prompt as one message into Claude Code.

---

## Context

You've completed Steps 01–06. Now build the contact form backend.

**Read first:**

- `docs/architecture.md` — section "Contact form"

**Note:** The directory is `backend/` (not `lambda/`). Spam protection lives
in AWS WAF in front of API Gateway (Step 08), not in the Lambda itself.

## What to do

### 1. Lambda handler (`backend/handler.py`)

Use **Python latest LTS** (the runtime version supported by AWS Lambda —
typically the most recent stable major). Use only standard library +
boto3 (which ships with the Lambda runtime). No frameworks.

**Endpoint:** `POST /contact`

**Request body** (JSON):
```json
{
  "name": "string",
  "email": "string",
  "company": "string (optional)",
  "message": "string"
}
```

**Validation:**
- `name`: 1–100 chars after trim
- `email`: must match a basic regex; SES will validate further
- `company`: optional, max 100 chars
- `message`: 10–5000 chars after trim
- All string fields trimmed before validation
- All values HTML-escaped before placing in the email body

**Email via SES:**
- From: env var `SES_FROM` (e.g. `noreply@gk-consulting.eu`)
- To: env var `SES_TO` (e.g. `hello@gk-consulting.eu`)
- Reply-To: the requester's `email` so you can reply directly
- Subject: `[Contact form] {name} — {company or 'Personal'}`
- Body: plaintext with all submitted fields and the source IP from
  `event['requestContext']['identity']['sourceIp']` (HTTP API: it's
  inside `requestContext.http.sourceIp`)

**Responses** (always include CORS headers):

- `200 OK`: `{ "ok": true }`
- `400 Bad Request`: `{ "ok": false, "errors": ["email", "message"] }` —
  array of field names that failed
- `500 Internal Server Error`: `{ "ok": false, "error": "internal" }` —
  on SES exception

**CORS headers:**
```
Access-Control-Allow-Origin: <SITE_ORIGIN env var>
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Methods: POST, OPTIONS
```

Handle OPTIONS preflight by returning 204 with the headers above.

**Logging:**
- Log validation failures by field name only (no PII): `"validation
  failed: ['email', 'message']"`
- Log SES failures with the boto3 error type, not the message body
- Use `print()` or `logging` — both go to CloudWatch automatically

**Code structure:**
- A single `handler.py` is fine; extract validators if it gets >150 lines
- Type-hint everything (`def handler(event: dict, context: Any) -> dict:`)
- Return responses via a small `_response(status, body)` helper that
  injects CORS headers consistently

### 2. Tests (`backend/test_handler.py`)

Use `pytest` and `moto` (the SES mock).

Cover:

- Happy path → 200, SES.send_email called with expected args
- Each validation failure: missing name, invalid email, message too short,
  message too long, name too long, company too long
- SES throws → 500, logged, no exception propagated to API Gateway
- OPTIONS request → 204 with CORS headers

Aim for >90% coverage on `handler.py`. `pytest --cov=handler` to verify.

`backend/requirements-dev.txt`:
```
pytest>=8
moto[ses]>=5
```

### 3. Frontend integration

Update `app/components/sections/Contact.tsx`:

- Add proper `onSubmit` handler:
  - Prevent default
  - Disable submit button, change label to "Sending..."
  - POST to `${process.env.NEXT_PUBLIC_API_URL}/contact` (env-configured)
  - Body: JSON with name, email, company, message
  - Headers: `Content-Type: application/json`
  - On 200: clear form, show success state — *"Thanks. I'll reply within
    two working days."* in italic Instrument Serif soft ink, replacing
    the form
  - On 400: parse `errors` array, show field-specific error text below
    each input in copper. Re-enable submit.
  - On network error or 500: show *"Something went wrong. Please email
    me directly at hello@gk-consulting.eu."* below the submit button.
    Re-enable submit.
- No extra dependencies — use plain `fetch()`. No react-hook-form,
  no axios.
- Form state via React `useState` (it's a Client Component already).

### 4. Local development

Two options for testing the form before AWS is provisioned:

**Option A: Lambda runs locally via SAM or python-lambda-local**
- Add a `make dev-backend` script that runs the handler with a local
  HTTP wrapper. Simplest: a tiny `backend/dev_server.py` that uses
  `http.server` to wrap the handler — no frameworks, ~30 lines.
- Set `NEXT_PUBLIC_API_URL=http://localhost:8080` in `app/.env.local`

**Option B: Just point at deployed API after Step 08**
- Skip local backend testing
- Document this in `docs/deployment.md`

Pick Option A and create `backend/dev_server.py`. It makes the dev loop
faster.

### 5. Environment variables

Document in `docs/deployment.md` and create `.env.example` files:

`app/.env.local.example`:
```
NEXT_PUBLIC_SITE_URL=https://gk-consulting.eu
NEXT_PUBLIC_API_URL=https://api.gk-consulting.eu
```

`backend/.env.example`:
```
SES_FROM=noreply@gk-consulting.eu
SES_TO=hello@gk-consulting.eu
SITE_ORIGIN=https://gk-consulting.eu
```

The Lambda's env vars are set in CDK (Step 08), not from a `.env` at
runtime — but keep the example file for documentation.

## Acceptance criteria

- [ ] `cd backend && python -m pytest -v` passes all tests
- [ ] `cd backend && python -m pytest --cov=handler` shows >90% coverage
- [ ] `cd backend && python dev_server.py` starts a local server on :8080
- [ ] In another terminal, `curl -X POST localhost:8080/contact -d '{...}'`
  works for valid + invalid payloads
- [ ] Frontend form submits to the local server, shows correct
  success/error states
- [ ] Network tab shows correct CORS preflight handling
- [ ] No SES calls actually go through in local mode (the dev server
  should mock SES — perhaps by setting `SES_FROM=mock` and skipping the
  send if so)

Commit with message: `feat(backend): contact form Lambda with validation and tests`.
