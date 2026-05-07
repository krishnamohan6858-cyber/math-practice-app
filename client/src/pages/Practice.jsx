import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";

const API_URL = "https://math-practice-app-2.onrender.com";

function Practice() {

  const { chapterId, level } = useParams();

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState("");

  const navigate = useNavigate();

  // ✅ Current logged-in user
  const userEmail = localStorage.getItem("userEmail");

  // ✅ User-wise keys
  const progressKey = `progress_${userEmail}`;
  const analyticsKey = `analytics_${userEmail}`;

  useEffect(() => {

    axios.get(
      `${API_URL}/questions/${chapterId}/${level}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
    .then(res => setQuestions(res.data))
    .catch(err => {
      console.error(err);

      // ✅ Invalid token handling
      if (err.response?.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");

        alert("Session expired. Please login again.");

        navigate("/login");

      } else {

        alert("Failed to load questions");
      }
    });

  }, [chapterId, level, navigate]);

  const handleAnswer = (ans) => {

    let newScore = score;

    // ✅ Correct Answer
    if (ans === questions[index].correct_answer) {

      newScore = score + 10;

      setScore(newScore);

      setXp("+10 XP 🎉");

    } else {

      setXp("❌ Wrong");
    }

    setTimeout(() => setXp(""), 1000);

    // ✅ Next Question
    if (index + 1 < questions.length) {

      setTimeout(() => {
        setIndex(prev => prev + 1);
      }, 500);

    } else {

      setTimeout(async () => {

        try {

          // ✅ Save Result in Backend
          await axios.post(
            `${API_URL}/submit`,
            {
              score: newScore,
              chapterId,
              level
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );

        } catch (err) {

          console.error(err);
        }

        // =========================
        // ✅ USER-WISE PROGRESS
        // =========================

        const progress =
          JSON.parse(localStorage.getItem(progressKey)) || {};

        progress[`${chapterId}-${level}`] = {
          score: newScore,
          completed: true
        };

        localStorage.setItem(
          progressKey,
          JSON.stringify(progress)
        );

        // =========================
        // ✅ USER-WISE ANALYTICS
        // =========================

        const analytics =
          JSON.parse(localStorage.getItem(analyticsKey))
          || {};

        const correct = newScore / 10;

        const accuracy =
          (correct / questions.length) * 100;

        if (!analytics[chapterId]) {
          analytics[chapterId] = [];
        }

        analytics[chapterId].push(accuracy);

        localStorage.setItem(
          analyticsKey,
          JSON.stringify(analytics)
        );

        // ✅ Navigate to Result
        navigate("/result", {
          state: {
            score: newScore,
            total: questions.length,
            correct
          }
        });

      }, 500);
    }
  };

  if (!questions.length) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  const progressPercent =
    ((index + 1) / questions.length) * 100;

  return (
    <div style={{
      padding: "20px",
      maxWidth: "600px",
      margin: "auto"
    }}>

      {/* ✅ Progress Bar */}
      <div style={{
        background: "#eee",
        height: "10px",
        borderRadius: "10px"
      }}>
        <div
          style={{
            width: `${progressPercent}%`,
            background: "green",
            height: "100%",
            borderRadius: "10px"
          }}
        ></div>
      </div>

      <p>
        Question {index + 1} / {questions.length}
      </p>

      <h3>Score: {score}</h3>

      {/* ✅ XP Message */}
      {xp && (
        <h2 style={{
          color: xp.includes("Wrong")
            ? "red"
            : "green"
        }}>
          {xp}
        </h2>
      )}

      <QuestionCard
        question={questions[index]}
        onAnswer={handleAnswer}
        index={index}
      />

    </div>
  );
}

export default Practice;