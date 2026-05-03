const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

// ✅ CORS config (important for frontend later)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

// ✅ Get chapters
app.get("/chapters", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM chapters ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chapters" });
  }
});

// ✅ Get questions (limit 10)
app.get("/questions/:chapterId/:level", async (req, res) => {
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

// ✅ Save result
app.post("/submit", async (req, res) => {
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

// ✅ PORT for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});