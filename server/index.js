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


// =========================
// ✅ HEALTH CHECK
// =========================
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});


// =========================
// ✅ SIGNUP
// =========================
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {

    // ✅ Check existing user
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user
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

    // ✅ Find user
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

    // ✅ Compare password
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        error: "Invalid password"
      });
    }

    // ✅ Generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,
      email: user.email
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
        ROUND(AVG(score), 2) as avg_score,
        COUNT(*) as attempts
      FROM results
      WHERE user_id = $1
      GROUP BY chapter_id
      ORDER BY chapter_id
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
// ✅ GET MY RESULTS
// =========================
app.get("/my-results", auth, async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT *
      FROM results
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch results"
    });
  }
});

// =========================
// ✅ LEADERBOARD
// =========================
app.get("/leaderboard", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT 
        users.email,
        COALESCE(SUM(results.score), 0) AS total_xp
      FROM users
      LEFT JOIN results
      ON users.id = results.user_id
      GROUP BY users.email
      ORDER BY total_xp DESC
      LIMIT 10
    `);

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch leaderboard"
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