const express = require("express");
const pool = require("../middlewares/db");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const ADMIN_ACCESS = process.env.ADMIN_ACCESS;

router.put("/updateAcess", verifyToken, async (req, res) => {
  const { username, authLevel } = req.body;
  //the user trying to make the update we got its info from verifyToken middleware
  const currentUser = req.user.username;
  const currentUserAuthLevel = req.user.authlevel;

  try {
    if (currentUserAuthLevel != ADMIN_ACCESS) {
      return res.status(403).json({
        message: "Access denied. You do not have the required permission",
      });
    }

    if (!username || !authLevel) {
      return res
        .status(400)
        .json({ message: "Username and access level are required" });
    }

    const query =
      "UPDATE users SET authLevel = $1 WHERE username = $2 RETURNING *;";
    const values = [authLevel, username];

    const result = await pool.query(query, values);

    res.status(200).json({
      message: "User access level updated successfully",
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

router.delete("/deleteUser", verifyToken, async (req, res) => {
  const { username } = req.body;
  //the user trying to make the delete we got its info from verifyToken middleware
  const currentUser = req.user.username;
  const currentUserAuthLevel = req.user.authlevel;

  try {
    if (currentUserAuthLevel != ADMIN_ACCESS) {
      return res.status(403).json({
        message: "Access denied. You do not have the required permission",
      });
    }

    if (!username) {
      return res.status(400).json({ message: "ID is required" });
    }

    const query = "DELETE FROM users WHERE username = $1;";
    const values = [username];
    const result = await pool.query(query, values);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user", error: err.detail });
  }
});

module.exports = router;
