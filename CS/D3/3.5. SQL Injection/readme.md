Step 1: Insert a test user (mandatory)

Create DB:
CREATE DATABASE injection_demo;
USE injection_demo;
CREATE TABLE users(id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50), password VARCHAR(50));
INSERT INTO users VALUES (1,'admin','admin123');

Step 2: Install and Start
npm i
npm start


Step 3: Demo scenarios

Open browser
http://localhost:3000

Step 3.1 : Normal login
Username: admin
Password: admin123

Button	    Result
Vulnerable	Success
Secure	  Success

Injection attack
Username: admin' OR '1'='1
Password: anything

Button	    Result
Vulnerable	Login Successful
Secure	    Invalid Input

