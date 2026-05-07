const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey";

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "No token provided"
      });
    }

    // Bearer TOKEN
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, SECRET);

    // ✅ Save user info
    req.user = decoded;

    next();

  } catch (err) {
    console.error(err);

    res.status(401).json({
      error: "Invalid token"
    });
  }
}

module.exports = auth;