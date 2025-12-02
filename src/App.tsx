import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login";
import AnggotaList from "./components/AnggotaList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/anggota" element={<AnggotaList />} />
      </Routes>
    </Router>
  );
}

export default App;
