# Doctor Appointment Booking API (Express + MongoDB)

Goal: a **simple** backend project where these 4 patterns fit naturally:
- **Idempotency** (safe retries for booking)
- **ETag + If-Match/If-None-Match** (caching + optimistic concurrency)
- **Pagination** (offset + cursor)
- **Logging** (request correlation + structured access logs) + **Audit logs** (who-did-what)

## 1) Setup

### Prerequisites
- Node.js 18+ (recommended)
- MongoDB running locally

### Configure
Copy `.env.example` to `.env` (optional).

```bash
cp .env.example .env
```

## 2) Run

```bash
npm install
npm start
```

Server: http://localhost:3000

Health check:
```bash
curl http://localhost:3000/health
```

## 3) Test/Seed (for teaching + Playwright)

Enable test routes via env:
`ENABLE_TEST_ROUTES=true`

Reset DB:
```bash
curl -X POST http://localhost:3000/test/reset
```

Seed next 14 days:
```bash
curl -X POST "http://localhost:3000/test/seed?days=14&baseDate=2026-01-01"
```

## 4) Pagination demos

### Offset pagination (easy page jumping)
```bash
curl "http://localhost:3000/doctors?page=1&limit=2"
curl "http://localhost:3000/doctors?page=2&limit=2"
```

### Cursor pagination (fast infinite scrolling)
```bash
curl "http://localhost:3000/doctors?mode=cursor&limit=2"
# Use nextCursor from response:
curl "http://localhost:3000/doctors?mode=cursor&limit=2&cursor=<nextCursor>"
```

## 5) ETag demos

### GET + If-None-Match (304 Not Modified)
```bash
curl -i http://localhost:3000/doctors/<doctorId>
# Copy ETag header and call again:
curl -i http://localhost:3000/doctors/<doctorId> -H 'If-None-Match: "<etag>"'
```

### PUT with If-Match (optimistic concurrency)
```bash
# Step 1: GET to get current ETag
curl -i http://localhost:3000/doctors/<doctorId>
# Step 2: PUT with If-Match
curl -i -X PUT http://localhost:3000/doctors/<doctorId> \
  -H 'Content-Type: application/json' \
  -H 'If-Match: "<etag>"' \
  -d '{"fee":650}'
```

If the ETag is stale, you get **412 Precondition Failed**.

## 6) Idempotency demo (booking retries)

1) List availability for a date (pick an AVAILABLE slotId):
```bash
curl "http://localhost:3000/doctors/<doctorId>/availability?date=2026-01-01&limit=5"
```

2) Book appointment (Idempotency-Key required):
```bash
curl -i -X POST http://localhost:3000/appointments \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: booking-001' \
  -d '{"patientId":"p1","doctorId":"<doctorId>","slotId":"<slotId>"}'
```

3) Retry same request with same Idempotency-Key (should NOT duplicate):
```bash
curl -i -X POST http://localhost:3000/appointments \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: booking-001' \
  -d '{"patientId":"p1","doctorId":"<doctorId>","slotId":"<slotId>"}'
```
You should see `Idempotent-Replay: true`.

### Simulate failures
Payment fail:
```bash
curl -i -X POST http://localhost:3000/appointments \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: booking-002' \
  -H 'X-Mock-Payment: FAILED' \
  -d '{"patientId":"p1","doctorId":"<doctorId>","slotId":"<slotId>"}'
```

## 7) Logging

### Access logs
Each request prints a JSON log to stdout with:
- requestId
- method/path/status
- durationMs

### Audit logs
List audit events:
```bash
curl "http://localhost:3000/audit/logs?limit=10"
```

