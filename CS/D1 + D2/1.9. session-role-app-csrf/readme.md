How to run
----------
npm install
npm start

How to test correctly
---------------------
1. Get CSRF token
GET http://localhost:5000/api/csrf-token

2️. Login (session-based + CSRF)
POST http://localhost:5000/api/auth/login

Headers:
X-CSRF-Token: <csrfToken>

Body:
{
  "email": "admin@test.com",
  "password": "123456"
}


➡ Session cookie is set automatically

3️. Access protected routes
GET /api/auth/profile
GET /api/auth/admin

(No CSRF header needed for GET, Session cookie is used)

4️. Logout (CSRF required)
POST /api/auth/logout

Headers:
X-CSRF-Token: <csrfToken>

Architecture rule to remember
Session Cookie → Authentication
CSRF Token     → Request Integrity
Role Middleware→ Authorization

These are three different security layers.

