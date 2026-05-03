import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Result from "./pages/Result";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice/:chapterId/:level" element={<Practice />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;