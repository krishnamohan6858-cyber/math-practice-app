import { useEffect, useState } from "react";
import axios from "axios";
import LevelButton from "../components/LevelButton";
import { useNavigate } from "react-router-dom";

function Home() {
  const [chapters, setChapters] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [analytics, setAnalytics] = useState({});

  const navigate = useNavigate();

  const API_URL = "https://math-practice-app-2.onrender.com";

  // ✅ Check login
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // 👑 Premium check
  const isPremiumUser = localStorage.getItem("isPremiumUser") === "true";

  useEffect(() => {

    // ✅ Fetch chapters
    axios.get(`${API_URL}/chapters`)
      .then(res => setChapters(res.data))
      .catch(err => console.error(err));

    // ✅ Fetch user results from backend
    if (token) {
      axios.get(`${API_URL}/my-results`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {

        const results = res.data || [];

        let xp = 0;
        const analyticsData = {};

        results.forEach(r => {

          xp += r.score || 0;

          const accuracy = (r.score / 30) * 100;

          if (!analyticsData[r.chapter_id]) {
            analyticsData[r.chapter_id] = [];
          }

          analyticsData[r.chapter_id].push(accuracy);
        });

        setTotalXP(xp);
        setAnalytics(analyticsData);

      })
      .catch(err => console.error(err));
    }

  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{
      padding: "20px",
      maxWidth: "900px",
      margin: "auto",
      fontFamily: "Arial"
    }}>

      {/* 🔐 AUTH BUTTONS */}
      <div style={{ textAlign: "right", marginBottom: "10px" }}>

        {!isLoggedIn ? (
          <>
            <button onClick={() => navigate("/login")}>
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              style={{ marginLeft: "10px" }}
            >
              Signup
            </button>
          </>
        ) : (
          <button onClick={handleLogout}>
            Logout
          </button>
        )}

      </div>

      {/* 👑 PREMIUM BADGE */}
      {isPremiumUser && (
        <div style={{
          background: "#fbbf24",
          padding: "10px",
          borderRadius: "10px",
          marginBottom: "15px",
          fontWeight: "bold",
          textAlign: "center"
        }}>
          👑 Premium User
        </div>
      )}

      {/* 🔥 XP HEADER */}
      <div style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(5px)",
        padding: "15px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}>
        <h2>🔥 Total XP: {totalXP}</h2>

        <div style={{
          background: "#eee",
          height: "10px",
          borderRadius: "10px"
        }}>
          <div style={{
            width: `${Math.min(totalXP, 100)}%`,
            background: "#4CAF50",
            height: "100%",
            borderRadius: "10px"
          }}></div>
        </div>
      </div>

      {/* 📊 PERFORMANCE */}
      <div style={{
        background: "rgba(255,255,255,0.9)",
        padding: "15px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}>
        <h2>📊 Your Performance</h2>

        {chapters.map(ch => {

          const data = analytics[ch.id] || [];

          const avg = data.length
            ? (
                data.reduce((a, b) => a + b, 0) / data.length
              ).toFixed(0)
            : null;

          return (
            <div key={ch.id} style={{ margin: "10px 0" }}>

              <strong>{ch.name}</strong> :{" "}

              {avg ? `${avg}%` : "No data"}

              {avg && avg < 50 && (
                <span style={{
                  color: "red",
                  marginLeft: "10px"
                }}>
                  ⚠️ Weak
                </span>
              )}

            </div>
          );
        })}
      </div>

      <h1 style={{ textAlign: "center" }}>
        📘 Math Practice
      </h1>

      {/* 📚 CHAPTER LIST */}
      {chapters.map(ch => (
        <div
          key={ch.id}
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(5px)",
            padding: "20px",
            margin: "20px 0",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}
        >
          <h2>{ch.name}</h2>

          <div>
            {[1, 2, 3, 4, 5].map(level => (
              <LevelButton
                key={level}
                chapterId={ch.id}
                level={level}
              />
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}

export default Home;