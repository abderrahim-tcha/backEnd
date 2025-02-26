require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const chartRoutes = require("./routes/chartRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(
  cors({
    origin: true, // Your frontend URL
    credentials: true, // Allows cookies to be sent
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/data", chartRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
