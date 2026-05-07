import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";

// ✅ CHANGE THIS
const API_URL = "https://math-practice-app-2.onrender.com";

function Practice() {
  const { chapterId, level } = useParams();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(
      `${API_URL}/questions/${chapterId}/${level}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
      .then(res => setQuestions(res.data));
  }, [chapterId, level]);

  const handleAnswer = (ans) => {
    let newScore = score;

    if (ans === questions[index].correct_answer) {
      newScore = score + 10;
      setScore(newScore);
      setXp("+10 XP 🎉");
    } else {
      setXp("❌ Wrong");
    }

    setTimeout(() => setXp(""), 1000);

    if (index + 1 < questions.length) {
      setTimeout(() => setIndex(prev => prev + 1), 500);
    } else {
      setTimeout(() => {

        // ✅ Backend save
        axios.post(
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

        const progress = JSON.parse(localStorage.getItem("progress")) || {};

        progress[`${chapterId}-${level}`] = {
          score: newScore,
          completed: true
        };

        localStorage.setItem("progress", JSON.stringify(progress));

        const correct = newScore / 10;
        const accuracy = (correct / questions.length) * 100;

        const analytics = JSON.parse(localStorage.getItem("analytics")) || {};

        if (!analytics[chapterId]) {
          analytics[chapterId] = [];
        }

        analytics[chapterId].push(accuracy);

        localStorage.setItem("analytics", JSON.stringify(analytics));

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

  if (!questions.length) return <h2>Loading...</h2>;

  const progressPercent = ((index + 1) / questions.length) * 100;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      
      <div style={{ background: "#eee", height: "10px", borderRadius: "10px" }}>
        <div
          style={{
            width: `${progressPercent}%`,
            background: "green",
            height: "100%",
            borderRadius: "10px"
          }}
        ></div>
      </div>

      <p>Question {index + 1} / {questions.length}</p>
      <h3>Score: {score}</h3>

      {xp && (
        <h2 style={{ color: xp.includes("Wrong") ? "red" : "green" }}>
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