import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";

import AnggotaList from "./components/AnggotaList";
import AnggotaEdit from "./components/AnggotaEdit";
import PinjamanList from "./components/PinjamanList";

import AngsuranList from "./components/AngsuranList";
import AngsuranForm from "./components/AngsuranForm";

// Wrapper component untuk AngsuranForm
function AngsuranFormWrapper() {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate("/angsuran");
  };

  return <AngsuranForm onSuccess={handleSuccess} />;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* Auth */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Master */}
        <Route path="/anggota" element={<AnggotaList />} />
        <Route path="/pinjaman" element={<PinjamanList />} />

        {/* Angsuran */}
        <Route path="/angsuran" element={<AngsuranList />} />
        <Route path="/angsuran/tambah" element={<AngsuranFormWrapper />} />
        <Route path="/angsuran/form/:id" element={<AngsuranFormWrapper />} />

      </Routes>
    </Router>
  );
}

export default App;
