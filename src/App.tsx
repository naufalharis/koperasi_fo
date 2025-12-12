import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";

import AnggotaList from "./components/AnggotaList";
import PinjamanList from "./components/PinjamanList";

import AngsuranList from "./components/AngsuranList";
import AngsuranForm from "./components/AngsuranForm";
import AnggotaEdit from "./components/AnggotaEdit";

import SimpananList from "./components/SimpananList";

import Layout from "./components/Layout/Layout";

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
      <Layout>
        <Routes>

          {/* Auth */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Master */}
          <Route path="/anggota" element={<AnggotaList />} />
          <Route path="/anggota/:id/edit" element={<AnggotaEdit />} />
          <Route path="/pinjaman" element={<PinjamanList />} />

          {/* Angsuran */}
          <Route path="/angsuran" element={<AngsuranList />} />
          <Route path="/angsuran/tambah" element={<AngsuranFormWrapper />} />
          <Route path="/angsuran/form/:id" element={<AngsuranFormWrapper />} />

          {/* Simpanan */}
          <Route path="/simpanan" element={<SimpananList />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
