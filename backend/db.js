const mongoose = require("mongoose");

const mongoURL = "mongodb://127.0.0.1:27017/LoginDetails"; // Ensure the MongoDB URL is correct

// Connect to MongoDB
mongoose.connect(mongoURL, {});

const db = mongoose.connection;

// Event handler for successful connection
db.once("connected", () => {
  console.log("Connection to MongoDB successful");
});

// Event handler for connection errors
db.on("error", (err) => {
  console.error("Connection to MongoDB failed:", err);
});

module.exports = db;
