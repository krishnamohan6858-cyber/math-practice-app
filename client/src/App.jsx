import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Result from "./pages/Result";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />

      <Route path="/practice/:chapterId/:level" element={
        <ProtectedRoute>
          <Practice />
        </ProtectedRoute>
      } />

      <Route path="/result" element={
        <ProtectedRoute>
          <Result />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;