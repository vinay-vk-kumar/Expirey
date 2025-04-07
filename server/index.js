require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { expireyRouter } = require("./routes/expirey");
const cookieParser = require("cookie-parser");
const cors = require("cors")

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/yourdb";

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://expirey.onrender.com', 'https://expirey.vercel.app', 'https://expirey-vinay-vk-kumars-projects.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/expirey", expireyRouter);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err.message);
    });
