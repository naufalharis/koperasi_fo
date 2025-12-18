import { Routes, Route, useNavigate } from "react-router-dom";

import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import Dashboard from "./pages/Dashboard";

import AnggotaList from "./components/AnggotaList";
import PinjamanList from "./components/PinjamanList";
import AngsuranList from "./components/AngsuranList";
import AngsuranForm from "./components/AngsuranForm";
import AnggotaEdit from "./components/AnggotaEdit";
import KasList from "./components/KasList";
import KasForm from "./components/KasForm";
import SimpananList from "./components/SimpananList";
import TabunganList from "./components/TabunganList";
import Layout from "./components/Layout/Layout";

// Wrapper AngsuranForm
function AngsuranFormWrapper() {
  const navigate = useNavigate();

  return <AngsuranForm onSuccess={() => navigate("/angsuran")} />;
}

function App() {
  return (
    <Layout>
      <Routes>

        {/* Auth */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Master */}
        <Route path="/anggota" element={<AnggotaList />} />
        <Route path="/anggota/:id/edit" element={<AnggotaEdit />} />
        <Route path="/pinjaman" element={<PinjamanList />} />

        {/* Angsuran */}
        <Route path="/angsuran" element={<AngsuranList />} />
        <Route path="/angsuran/tambah" element={<AngsuranFormWrapper />} />
        <Route path="/angsuran/form/:id" element={<AngsuranFormWrapper />} />

        {/* Kas */}
        <Route path="/kas" element={<KasList />} />
        <Route path="/kas/create" element={<KasForm />} />
        <Route path="/kas/:id/edit" element={<KasForm />} />

        {/* Simpanan & Tabungan */}
        <Route path="/simpanan" element={<SimpananList />} />
        <Route path="/tabungan" element={<TabunganList />} />

      </Routes>
    </Layout>
  );
}

export default App;
