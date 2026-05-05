import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API = "https://math-practice-app-2.onrender.com"; // ✅ your backend URL

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/login`, {
        email,
        password
      });

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      alert("Login Successful 🚀");
      navigate("/");

    } catch (err) {
      alert("Login Failed ❌");
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;