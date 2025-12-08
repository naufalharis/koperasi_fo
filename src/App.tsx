import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import AnggotaList from "./components/AnggotaList";
import AnggotaEdit from "./components/AnggotaEdit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/anggota" element={<AnggotaList />} />
        <Route path="/anggota/:id/edit" element={<AnggotaEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
