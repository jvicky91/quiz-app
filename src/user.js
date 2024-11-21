let users = {}; // In-memory user storage
let userIdCounter = 1;

const express = require("express");
const router = express.Router();

// Create User
router.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const userId = userIdCounter++;
  users[userId] = { id: userId, name, email, scores: [] };

  res.status(201).json({ message: "User created", userId });
});

// Get User
router.get("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const user = users[userId];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// Export the router and the users object
module.exports = { router, users };
