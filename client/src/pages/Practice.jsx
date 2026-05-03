import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";

function Practice() {
  const { chapterId, level } = useParams();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/questions/${chapterId}/${level}`)
      .then(res => setQuestions(res.data));
  }, [chapterId, level]);

  const handleAnswer = (ans) => {
    let newScore = score;

    // ✅ Calculate score synchronously
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

        // ✅ Save to backend
        axios.post("http://localhost:5000/submit", {
          score: newScore,
          chapterId,
          level
        });

        // ✅ Save progress locally
        const progress = JSON.parse(localStorage.getItem("progress")) || {};

        progress[`${chapterId}-${level}`] = {
          score: newScore,
          completed: true
        };

        localStorage.setItem("progress", JSON.stringify(progress));

        // ✅ Analytics calculation
        const correct = newScore / 10;
        const accuracy = (correct / questions.length) * 100;

        const analytics = JSON.parse(localStorage.getItem("analytics")) || {};

        if (!analytics[chapterId]) {
          analytics[chapterId] = [];
        }

        analytics[chapterId].push(accuracy);

        localStorage.setItem("analytics", JSON.stringify(analytics));

        // ✅ Navigate to result
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
      
      {/* Progress Bar */}
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

      {/* XP Feedback */}
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