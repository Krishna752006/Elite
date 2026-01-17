
const express = require("express");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/orders");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/order_pagination_demo")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/orders", orderRoutes);

app.listen(3000, () =>
  console.log("Order Pagination Demo running on http://localhost:3000")
);
