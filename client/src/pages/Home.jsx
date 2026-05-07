import { useEffect, useState } from "react";
import axios from "axios";
import LevelButton from "../components/LevelButton";
import { useNavigate } from "react-router-dom";

function Home() {

  const [chapters, setChapters] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const API_URL = "https://math-practice-app-2.onrender.com";

  const token = localStorage.getItem("token");

  // ✅ Redirect if not logged in
  useEffect(() => {

    if (!token) {
      navigate("/login");
      return;
    }

    fetchData();

  }, []);

  const fetchData = async () => {

    try {

      // ✅ Get chapters
      const res = await axios.get(
        `${API_URL}/chapters`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setChapters(res.data);

      // ✅ XP Calculation
      const progress =
        JSON.parse(localStorage.getItem("progress")) || {};

      let xp = 0;

      Object.values(progress).forEach(p => {
        xp += p.score || 0;
      });

      setTotalXP(xp);

      // ✅ Analytics
      const savedAnalytics =
        JSON.parse(localStorage.getItem("analytics")) || {};

      setAnalytics(savedAnalytics);

    } catch (err) {

      console.error(err);

      // ✅ Invalid token handling
      if (err.response?.status === 401) {

        localStorage.removeItem("token");

        alert("Session expired. Please login again.");

        navigate("/login");
      }

    } finally {

      setLoading(false);
    }
  };

  // ✅ Logout
  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div style={{
      padding: "20px",
      maxWidth: "900px",
      margin: "auto",
      fontFamily: "Arial"
    }}>

      {/* ✅ HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px"
      }}>

        <h2>📘 Math Practice</h2>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

      {/* ✅ XP */}
      <div style={{
        background: "#f5f5f5",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px"
      }}>

        <h3>🔥 Total XP: {totalXP}</h3>

        <div style={{
          background: "#ddd",
          height: "10px",
          borderRadius: "10px"
        }}>

          <div style={{
            width: `${Math.min(totalXP, 100)}%`,
            background: "green",
            height: "100%",
            borderRadius: "10px"
          }}></div>

        </div>
      </div>

      {/* ✅ PERFORMANCE */}
      <div style={{
        background: "#f5f5f5",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px"
      }}>

        <h2>📊 Your Performance</h2>

        {chapters.map(ch => {

          const data = analytics[ch.id] || [];

          const avg = data.length
            ? (
                data.reduce((a, b) => a + b, 0) /
                data.length
              ).toFixed(0)
            : null;

          return (
            <div key={ch.id} style={{ marginBottom: "10px" }}>

              <strong>{ch.name}</strong> :

              {" "}

              {avg ? `${avg}%` : "No data"}

            </div>
          );
        })}
      </div>

      {/* ✅ CHAPTERS */}
      {chapters.map(ch => (
        <div
          key={ch.id}
          style={{
            background: "#fff",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
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