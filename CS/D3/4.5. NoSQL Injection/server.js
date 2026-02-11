
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const path = require("path");

const app = express();

// serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/injection_demo");

app.use("/auth", authRoutes);

app.listen(3000, () => console.log("Backend running on port 3000"));
