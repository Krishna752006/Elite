Only backend testing
--------------------
Step 1: Install and Start
npm i
npm start

Step 2: Insert a test user (mandatory)

Open Mongo shell:

mongosh

use injection_demo

db.users.insertOne({
  username: "admin",
  password: "1234"
})

Step 3: Thunder Client testing

Test-1: Normal login (vulnerable API)
Method: POST
URL:
http://localhost:3000/auth/login-vulnerable

Headers
Content-Type: application/json
Body (JSON)

{
  "username": "admin",
  "password": "1234"
}

Expected response
Login Successful (Vulnerable)

Test-2: Injection attack
Body (JSON)
{
  "username": { "$ne": null },
  "password": { "$ne": null }
}

Result
Login Successful (Vulnerable)

Test-3: Secure API (normal credentials)
URL
http://localhost:5000/auth/login-secure

Body (JSON)
{
  "username": "admin",
  "password": "1234"
}


Response:
Login Successful (Secure)

Test 4: Secure API with injection payload
Body (JSON)
{
  "username": { "$ne": null },
  "password": { "$ne": null }
}

Response
Invalid Input Type


Frontend + Backend testing
---------------------------
Step 1: Install and Start
npm i
npm start

Step 2: Insert a test user (mandatory)

Open Mongo shell:

mongosh

use injection_demo

db.users.insertOne({
  username: "admin",
  password: "1234"
})

Step 3: Demo scenarios

Open browser
http://localhost:5000

Step 3.1 : Normal login
Username: admin
Password: 1234

Button	    Result
Vulnerable	Success
Secure	  Success

Injection attack
Username: {"$ne": null}
Password: {"$ne": null}

Button	    Result
Vulnerable	Login Successful
Secure	    Invalid Input

