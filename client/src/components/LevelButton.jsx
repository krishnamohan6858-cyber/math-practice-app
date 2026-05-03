import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UpgradeModal from "./UpgradeModal";

function LevelButton({ chapterId, level }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const progress = JSON.parse(localStorage.getItem("progress")) || {};

  const currentKey = `${chapterId}-${level}`;
  const prevKey = `${chapterId}-${level - 1}`;

  const isCompleted = progress[currentKey]?.completed;

  // 🔓 Unlock logic
  const isUnlocked = level === 1 || progress[prevKey]?.completed;

  // 💰 Premium logic
  const isPremiumLevel = level > 2;

  // 👑 Check if user purchased
  const isPremiumUser = localStorage.getItem("isPremiumUser") === "true";

  // ✅ Final access rule
  const canAccess = isUnlocked && (!isPremiumLevel || isPremiumUser);

  return (
    <>
      <button
        onClick={() => {
          if (canAccess) {
            navigate(`/practice/${chapterId}/${level}`);
          } else if (isPremiumLevel && !isPremiumUser) {
            setShowModal(true);
          } else {
            alert("🔒 Complete previous level first");
          }
        }}
        style={{
          margin: "8px",
          padding: "10px 18px",
          borderRadius: "20px",
          border: "none",
          cursor: isUnlocked ? "pointer" : "not-allowed",

          background: isCompleted
            ? "#22c55e"
            : isPremiumLevel && !isPremiumUser
            ? "#f59e0b"
            : isUnlocked
            ? "#3b82f6"
            : "#9ca3af",

          color: "white",
          fontWeight: "bold",
          transition: "all 0.2s ease",
          transform: "scale(1)"
        }}
        onMouseOver={(e) => {
          if (isUnlocked) e.target.style.transform = "scale(1.08)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "scale(1)";
        }}
        onMouseDown={(e) => {
          if (isUnlocked) e.target.style.transform = "scale(0.95)";
        }}
        onMouseUp={(e) => {
          if (isUnlocked) e.target.style.transform = "scale(1.08)";
        }}
      >
        {isCompleted
          ? `✅ Level ${level}`
          : isPremiumLevel && !isPremiumUser
          ? `💰 Level ${level}`
          : isUnlocked
          ? `Level ${level}`
          : `🔒 Level ${level}`}
      </button>

      <UpgradeModal
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

export default LevelButton;