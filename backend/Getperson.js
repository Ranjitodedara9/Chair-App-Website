const express = require("express");
const router = express.Router();
const Person = require("./models/person");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { jwtAuthMidleWare, generateToken } = require("./jwt");

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../chair-app/src/Component/profileimg");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Uploads directory
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage }).single("profileImage"); // Expecting field name 'profileImage'

// Route to create a new Person with image upload
router.post("/person", (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { username, email, mobile, password } = req.body;

      // Check if all required fields are provided
      if (!username || !email || !mobile || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if file was uploaded successfully
      if (!req.file) {
        return res.status(400).json({ message: "Profile image is required" });
      }

      // Save file path to profileImage
      const profileImage = req.file.filename;

      // Create new Person object
      const newPerson = new Person({
        username,
        email,
        mobile,
        password, // Save hashed password
        profileImage,
      });

      // Save person to database
      const savedPerson = await newPerson.save();

      // Generate a token
      const token = generateToken({ username: savedPerson.username });

      res.status(201).json({ token });
    } catch (err) {
      console.error("Error:", err.message);
      res.status(400).json({ message: err.message });
    }
  });
});

module.exports = router;
