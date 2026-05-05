import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API = "https://math-practice-app-2.onrender.com";

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please fill all fields ⚠️");
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/login`, {
        email,
        password
      });

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      alert("Login Successful 🚀");
      navigate("/");

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

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

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* 🔗 Go to Signup */}
      <p style={{ marginTop: "10px" }}>
        Don't have an account?{" "}
        <span 
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/signup")}
        >
          Signup
        </span>
      </p>
    </div>
  );
}

export default Login;