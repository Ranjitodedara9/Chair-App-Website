const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env file

const jwtAuthMidleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const generateToken = (userdata) => {
  var key = jwt.sign(userdata, process.env.JWT_SECRET);

  return key;
};

module.exports = { jwtAuthMidleWare, generateToken };
