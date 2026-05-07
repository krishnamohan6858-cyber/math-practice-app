const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const auth = require("./middleware/auth");

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

const SECRET = "mysecretkey";

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});


// =========================
// ✅ SIGNUP
// =========================
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO users(email, password)
      VALUES($1, $2)
      `,
      [email, hashedPassword]
    );

    res.json({
      message: "Signup successful"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Signup failed"
    });
  }
});


// =========================
// ✅ LOGIN
// =========================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        error: "Invalid password"
      });
    }

    // ✅ TOKEN WITH USER ID
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      SECRET
    );

    res.json({
      token
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Login failed"
    });
  }
});


// =========================
// ✅ GET CHAPTERS
// =========================
app.get("/chapters", auth, async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM chapters ORDER BY id"
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch chapters"
    });
  }
});


// =========================
// ✅ GET QUESTIONS
// =========================
app.get("/questions/:chapterId/:level", auth, async (req, res) => {
  const { chapterId, level } = req.params;

  try {

    const result = await pool.query(
      `
      SELECT * FROM questions
      WHERE chapter_id=$1 AND level=$2
      LIMIT 10
      `,
      [chapterId, level]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch questions"
    });
  }
});


// =========================
// ✅ SAVE RESULT
// =========================
app.post("/submit", auth, async (req, res) => {
  const { score, chapterId, level } = req.body;

  try {

    await pool.query(
      `
      INSERT INTO results(user_id, score, chapter_id, level)
      VALUES($1, $2, $3, $4)
      `,
      [
        req.user.id,
        score,
        chapterId,
        level
      ]
    );

    res.json({
      message: "Result saved"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to save result"
    });
  }
});


// =========================
// ✅ MY PERFORMANCE
// =========================
app.get("/my-performance", auth, async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT 
        chapter_id,
        AVG(score) as avg_score,
        COUNT(*) as attempts
      FROM results
      WHERE user_id = $1
      GROUP BY chapter_id
      `,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch performance"
    });
  }
});


// =========================
// ✅ PORT
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});