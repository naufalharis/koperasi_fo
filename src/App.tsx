import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";

import Dashboard from "./pages/Dashboard";

import AnggotaList from "./components/AnggotaList";
import AnggotaEdit from "./components/AnggotaEdit";

import PinjamanList from "./components/PinjamanList";

import AngsuranList from "./components/AngsuranList";
import AngsuranForm from "./components/AngsuranForm";

import KasList from "./components/KasList";
import KasForm from "./components/KasForm";

import SimpananList from "./components/SimpananList";
import TabunganList from "./components/TabunganList";

import JabatanList from "./components/JabatanList";
import JabatanForm from "./components/JabatanForm";

import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import KategoriJangkaWaktuPage from "./components/JangkaWaktuPage";

/* =====================
   Wrapper Angsuran Form
===================== */
function AngsuranFormWrapper() {
  const navigate = useNavigate();
  return <AngsuranForm onSuccess={() => navigate("/angsuran")} />;
}

function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* PROTECTED */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* DEFAULT DASHBOARD */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* ANGGOTA */}
          <Route path="anggota" element={<AnggotaList />} />
          <Route path="anggota/:id/edit" element={<AnggotaEdit />} />

          {/* PINJAMAN */}
          <Route path="pinjaman" element={<PinjamanList />} />

          {/* ANGSURAN */}
          <Route path="angsuran" element={<AngsuranList />} />
          <Route path="angsuran/tambah" element={<AngsuranFormWrapper />} />
          <Route path="angsuran/form/:id" element={<AngsuranFormWrapper />} />

          {/* KAS */}
          <Route path="kas" element={<KasList />} />
          <Route path="kas/create" element={<KasForm />} />
          <Route path="kas/:id/edit" element={<KasForm />} />

          {/* SIMPANAN */}
          <Route path="simpanan" element={<SimpananList />} />

          {/* TABUNGAN */}
          <Route path="tabungan" element={<TabunganList />} />

          {/* Jangka Waktu */}
          <Route path="jangkaWaktu" element={<KategoriJangkaWaktuPage />} />

          {/* JABATAN */}
          <Route path="jabatan" element={<JabatanList />} />
          <Route path="jabatan/create" element={<JabatanForm />} />
          <Route path="jabatan/:id/edit" element={<JabatanForm />} />
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
