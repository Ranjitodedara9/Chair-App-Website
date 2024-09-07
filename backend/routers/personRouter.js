const express = require("express");
const router = express.Router();
const Person = require("../models/person");
const { generateToken } = require("../jwt");

router.post("/user", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await Person.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = generateToken({ username: user.username });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all user data
router.get("/data", async (req, res) => {
  try {
    const response = await Person.find();

    res.status(200).json(response); // Use 200 for successful GET request
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a user by ID
router.delete("/person/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Person.findByIdAndDelete(id); // Changed User to Person
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

router.delete("/person", async (req, res) => {
  try {
    await Person.deleteMany({});
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting users", error });
  }
});

module.exports = router;
