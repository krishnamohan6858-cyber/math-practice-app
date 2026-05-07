const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const pool = require("./db");

const app = express();

// ✅ Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔐 Secret (later move to env)
const SECRET = "mysecretkey";


// =====================
// ✅ AUTH MIDDLEWARE
// =====================
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};


// =====================
// ✅ HEALTH CHECK
// =====================
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});


// =====================
// ✅ AUTH ROUTES
// =====================

// 🔹 Signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "User already exists" });
  }
});

// 🔹 Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, SECRET);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});


// =====================
// 📚 CONTENT ROUTES
// =====================

// ✅ Get chapters
app.get("/chapters", auth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM chapters ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chapters" });
  }
});

// ✅ Get questions
app.get("/questions/:chapterId/:level", auth, async (req, res) => {
  const { chapterId, level } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM questions WHERE chapter_id=$1 AND level=$2 LIMIT 10",
      [chapterId, level]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});


// =====================
// 💾 USER PROGRESS (PROTECTED)
// =====================

// ✅ Save progress (AUTH REQUIRED)
app.post("/save-progress", auth, async (req, res) => {
  const { chapterId, level, score } = req.body;

  try {
    await pool.query(
      "INSERT INTO progress (user_id, chapter_id, level, score) VALUES ($1,$2,$3,$4)",
      [req.user.id, chapterId, level, score]
    );

    res.json({ message: "Progress saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save progress" });
  }
});


// =====================
// 📝 LEGACY (OPTIONAL)
// =====================

// ⚠️ You can REMOVE this later
app.post("/submit", auth, async (req, res) => {
  const { score, chapterId, level } = req.body;

  try {
    await pool.query(
      "INSERT INTO results(score, chapter_id, level) VALUES($1,$2,$3)",
      [score, chapterId, level]
    );

    res.json({ message: "Result saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save result" });
  }
});


// =====================
// 🚀 SERVER START
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});