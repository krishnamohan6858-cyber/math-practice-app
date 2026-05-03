import { useLocation, useNavigate } from "react-router-dom";

function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const score = state?.score || 0;
  const total = state?.total || 0;
  const correct = state?.correct || 0;

  const accuracy = total ? ((correct / total) * 100).toFixed(0) : 0;

  // 📊 Smart feedback
  let message = "";
  let color = "";

  if (accuracy == 100) {
    message = "🔥 Perfect! You have mastered this level.";
    color = "green";
  } else if (accuracy >= 70) {
    message = "💪 Good job! A little more practice will make it perfect.";
    color = "blue";
  } else if (accuracy >= 40) {
    message = "⚠️ You need more practice. Focus on basics.";
    color = "orange";
  } else {
    message = "❌ Weak performance. Revise concepts before retrying.";
    color = "red";
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>🎯 Result Analysis</h1>

      <h2>Score: {score}</h2>
      <p>Total Questions: {total}</p>
      <p>Correct Answers: {correct}</p>
      <p>Accuracy: {accuracy}%</p>

      {/* 📊 Feedback Box */}
      <div style={{
        marginTop: "20px",
        padding: "15px",
        borderRadius: "10px",
        background: "#f5f5f5",
        color: color,
        fontWeight: "bold"
      }}>
        {message}
      </div>

      <button 
        onClick={() => navigate("/")}
        style={{ marginTop: "20px", padding: "10px" }}
      >
        Go Home
      </button>
    </div>
  );
}

export default Result;