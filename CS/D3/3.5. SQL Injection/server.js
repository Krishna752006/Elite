
const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "injection_demo"
});

db.connect();

// Vulnerable Login
app.post("/login-vulnerable", (req, res) => {
  const { username, password } = req.body;

  const query =
    "SELECT * FROM users WHERE username = '" +
    username +
    "' AND password = '" +
    password +
    "'";

  db.query(query, (err, results) => {
    if (err) {
      console.error("SQL Error (vulnerable):", err.message);
      return res.json({
        success: false,
        error: "SQL error occurred",
        details: err.message
      });
    }

    if (results.length > 0) {
      return res.json({
        success: true,
        message: "Logged in (vulnerable)",
        results
      });
    }

    res.json({
      success: false,
      message: "Invalid credentials"
    });
  });
});

// Secure Login (Prepared Statement)
app.post("/login-secure", (req, res) => {
  const { username, password } = req.body;

  const query =
    "SELECT * FROM users WHERE username = ? AND password = ?";

  db.execute(query, [username, password], (err, results) => {
    if (err) {
      console.error("SQL Error (safe):", err.message);
      return res.json({
        success: false,
        error: "SQL error"
      });
    }

    if (results.length > 0) {
      return res.json({
        success: true,
        message: "Logged in (safe)"
      });
    }

    res.json({
      success: false,
      message: "Invalid credentials"
    });
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
