const express = require("express");
const mongoose = require("mongoose");
const MongoDB = require("./config/connection");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8888;

// Connect to MongoDB
MongoDB()

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }))

// Routes
const userRouters = require("./routes/usersRoute");
const authRouters = require("./routes/authRoute");
const categoryRouters = require("./routes/categoryRoute");
const incomeRouters = require("./routes/incomeRoute");
const propRouters = require("./routes/propRoute");
const locationRoutes = require("./routes/locationRoute");
const bookingRoutes = require("./routes/bookingRoute");
const reviewRoutes = require("./routes/reviewRoute");
const paymentRoutes = require("./routes/paymentRoute");

app.use("/auth", authRouters);
app.use("/users", userRouters);
app.use("/category", categoryRouters);
app.use("/income", incomeRouters);
app.use("/property", propRouters);
app.use("/location", locationRoutes);
app.use("/booking", bookingRoutes);
app.use("/review", reviewRoutes);
app.use("/payment", paymentRoutes);


// Start server
app.listen(port, () => {
  console.log(`Server is runnning on http://localhost:${port}`);
});
