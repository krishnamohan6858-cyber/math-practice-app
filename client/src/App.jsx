import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Result from "./pages/Result";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/practice/:chapterId/:level" element={<Practice />} />
      <Route path="/result" element={<Result />} />

      {/* 🔐 Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;