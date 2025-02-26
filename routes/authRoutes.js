const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../middlewares/db");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Name and password are required" });
  }
  const authLevel = 0;

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const query =
      "INSERT INTO users (Username, Password, AuthLevel) VALUES ($1, $2, $3) RETURNING *;";
    const values = [username, hashedPassword, authLevel];

    const result = await pool.query(query, values);

    // Create JWT token for the user after registration(same with login)

    let data = {
      username: username,
      authlevel: authLevel,
    };
    let token = jwt.sign(data, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRATION });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production (HTTPS required)
    });

    res.status(200).json({
      message: "User registered",
      data: data,
    });
    console.log("User registered in");
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error registering user", error: err.detail });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Name and password are required" });
  }

  try {
    const query = "SELECT * FROM users WHERE Username = $1;";
    const values = [username];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create JWT token for the user

    let data = {
      username: user.username,
      authlevel: user.authlevel,
    };
    let token = jwt.sign(data, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRATION });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production (HTTPS required)
    });

    res.status(200).json({
      message: "User logged in",
      data: data,
    });
    console.log("User logged in");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during login", error: err.detail });
  }
});

module.exports = router;
