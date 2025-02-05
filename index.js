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
app.use(cors({ origin: "http://localhost:5173" })); // Update origin as needed
app.use(express.json({ limit: "10mb" })); // Adjust size as needed
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

app.use("/auth", authRouters);
app.use("/users", userRouters);
app.use("/category", categoryRouters);
app.use("/income", incomeRouters);
app.use("/property", propRouters);
app.use("/location", locationRoutes);
app.use("/booking", bookingRoutes);
app.use("/review", reviewRoutes);



// app.use(
//   cors({
//     origin: (origin, callback) => {
//       const allowedOrigins = [
//         "http://localhost:3000",
//         "http://localhost:5173"
//       ];
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//   })
// );

// const corsOptions = {
//   origin: [
//     "http://localhost:5173"
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'x-file-name']
// };

// // Apply CORS before any routes
// app.use(cors(corsOptions));

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Static files
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }
// app.use("/images", express.static(uploadDir));

// // Image upload endpoint
// app.post("/upload", (req, res) => {
//   const fileName = req.headers["x-file-name"];
//   if (!fileName) {
//     return res.status(400).json({ error: "Missing x-file-name header" });
//   }

//   const filePath = path.join(uploadDir, fileName);
//   const writeStream = fs.createWriteStream(filePath);

//   req.pipe(writeStream);

//   writeStream.on("finish", () => {
//     res.setHeader("Access-Control-Allow-Origin", "*");  // Allow CORS
//     res.status(200).json({ filePath: `/images/${fileName}` });
//   });

//   writeStream.on("error", (err) => {
//     console.error("Error saving file:", err);
//     res.status(500).json({ error: "Failed to save file" });
//   });
// });


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
