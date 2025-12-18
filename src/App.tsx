import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";

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

// Wrapper Angsuran Form
function AngsuranFormWrapper() {
  const navigate = useNavigate();

  return <AngsuranForm onSuccess={() => navigate("/angsuran")} />;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* PROTECTED (TOKEN WAJIB) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>

            <Route path="/anggota" element={<AnggotaList />} />
            <Route path="/anggota/:id/edit" element={<AnggotaEdit />} />

            <Route path="/pinjaman" element={<PinjamanList />} />

            <Route path="/angsuran" element={<AngsuranList />} />
            <Route path="/angsuran/tambah" element={<AngsuranFormWrapper />} />
            <Route path="/angsuran/form/:id" element={<AngsuranFormWrapper />} />

            <Route path="/kas" element={<KasList />} />
            <Route path="/kas/create" element={<KasForm />} />
            <Route path="/kas/:id/edit" element={<KasForm />} />

            <Route path="/simpanan" element={<SimpananList />} />
            <Route path="/tabungan" element={<TabunganList />} />

            <Route path="/jabatan" element={<JabatanList />} />
            <Route path="/jabatan/create" element={<JabatanForm />} />
            <Route path="/jabatan/:id/edit" element={<JabatanForm />} />

          </Route>
        </Route>

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
