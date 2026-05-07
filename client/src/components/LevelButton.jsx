import { useNavigate } from "react-router-dom";

function LevelButton({ chapterId, level }) {

  const navigate = useNavigate();

  // ✅ Current user
  const userEmail = localStorage.getItem("userEmail");

  // ✅ User-specific progress key
  const progressKey = `progress_${userEmail}`;

  // ✅ Load ONLY current user progress
  const progress =
    JSON.parse(localStorage.getItem(progressKey))
    || {};

  const current =
    progress[`${chapterId}-${level}`];

  const completed = current?.completed;

  // ✅ Lock logic
  const previousLevel =
    progress[`${chapterId}-${level - 1}`];

  const locked =
    level !== 1 &&
    !previousLevel?.completed;

  const handleClick = () => {

    if (locked) {
      alert("Complete previous level first 🔒");
      return;
    }

    navigate(`/practice/${chapterId}/${level}`);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        margin: "10px",
        padding: "15px 25px",
        border: "none",
        borderRadius: "30px",
        cursor: locked ? "not-allowed" : "pointer",
        fontWeight: "bold",
        color: "white",
        background: completed
          ? "#22c55e"
          : locked
          ? "#9ca3af"
          : "#3b82f6"
      }}
    >

      {completed
        ? "☑️ "
        : locked
        ? "🔒 "
        : ""}

      Level {level}

    </button>
  );
}

export default LevelButton;