import { useLocation, useNavigate } from "react-router-dom";

function Result() {

  const location = useLocation();

  const navigate = useNavigate();

  const {
    score,
    total,
    correct
  } = location.state;

  const percentage =
    ((correct / total) * 100).toFixed(0);

  let message = "";

  if (percentage >= 80) {
    message = "🔥 Excellent Work!";
  } else if (percentage >= 50) {
    message = "👍 Good Job!";
  } else {
    message = "📚 Keep Practicing!";
  }

  return (
    <div style={{
      textAlign: "center",
      marginTop: "80px",
      fontFamily: "Arial"
    }}>

      <h1>🎉 Quiz Finished</h1>

      <h2>{message}</h2>

      <h3>Score: {score}</h3>

      <h3>
        Correct Answers:
        {" "}
        {correct}/{total}
      </h3>

      <h3>
        Accuracy:
        {" "}
        {percentage}%
      </h3>

      {/* ✅ Performance Bar */}
      <div style={{
        width: "300px",
        height: "20px",
        background: "#ddd",
        margin: "20px auto",
        borderRadius: "10px"
      }}>

        <div style={{
          width: `${percentage}%`,
          height: "100%",
          background:
            percentage >= 80
              ? "green"
              : percentage >= 50
              ? "orange"
              : "red",
          borderRadius: "10px"
        }}></div>

      </div>

      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        Back to Home
      </button>

    </div>
  );
}

export default Result;