import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API = "https://math-practice-app-2.onrender.com";

  const handleSignup = async () => {
    if (!email || !password) {
      return alert("Please fill all fields ⚠️");
    }

    if (password.length < 6) {
      return alert("Password must be at least 6 characters 🔐");
    }

    try {
      setLoading(true);

      await axios.post(`${API}/signup`, {
        email,
        password
      });

      alert("Signup Successful ✅");
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Signup Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Signup</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Signing up..." : "Signup"}
      </button>
    </div>
  );
}

export default Signup;