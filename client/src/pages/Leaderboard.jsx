import { useEffect, useState } from "react";
import axios from "axios";

function Leaderboard() {

  const [users, setUsers] = useState([]);

  const API_URL =
    "https://math-practice-app-2.onrender.com";

  useEffect(() => {

    axios.get(`${API_URL}/leaderboard`)
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error(err);
      });

  }, []);

  return (
    <div style={{
      maxWidth: "700px",
      margin: "auto",
      padding: "20px",
      fontFamily: "Arial"
    }}>

      <h1 style={{
        textAlign: "center",
        marginBottom: "30px"
      }}>
        🏆 Leaderboard
      </h1>

      {users.map((user, index) => (

        <div
          key={index}
          style={{
            background: "#fff",
            padding: "20px",
            marginBottom: "15px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between"
          }}
        >

          <div>
            <strong>
              #{index + 1}
            </strong>

            {" "} {user.email}
          </div>

          <div>
            🔥 {user.total_xp} XP
          </div>

        </div>
      ))}

    </div>
  );
}

export default Leaderboard;