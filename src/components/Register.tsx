// RegisterPage.tsx
import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

interface Jabatan {
  id: string;
  nama: string;
}

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noHp, setNoHp] = useState("");
  const [jabatanId, setJabatanId] = useState<string | undefined>(undefined);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJabatan = async () => {
      try {
        const res = await api.get<Jabatan[]>("/jabatan");
        setJabatanList(res.data);
        if (res.data.length > 0 && !jabatanId) setJabatanId(res.data[0].id);
      } catch (err) {
        console.error("Gagal fetch jabatan:", err);
      }
    };
    fetchJabatan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!jabatanId) {
      setError("Pilih jabatan terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        nama,
        email,
        password,
        alamat,
        no_hp: noHp,
        id_jabatan: jabatanId,
      });

      const loginRes = await api.post("/auth/login", { email, password });
      const token = loginRes.data.access_token || loginRes.data.token || loginRes.data.accessToken;
      if (!token) throw new Error("Token tidak ditemukan pada response login");

      localStorage.setItem("token", token);

      navigate("/login");
    } catch (err: any) {
      console.error("Register error:", err?.response?.data || err);
      const message = err?.response?.data?.message || (err?.message ?? "Gagal register");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-root">
      <div className="rp-card">
        <div className="rp-aside">
          <div className="rp-brand">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M7 12h10M7 7h10M7 17h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <h1>Kooperasi</h1>
          </div>

          <p className="rp-desc">Daftar sebagai anggota — akses koleksi, peminjaman, dan riwayat.</p>

          <div className="rp-illustration" aria-hidden>
            <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="20" width="80" height="110" rx="6" />
              <rect x="90" y="30" width="120" height="90" rx="6" />
            </svg>
          </div>

          <div className="rp-footer-note">Sudah punya akun? <button className="rp-link" onClick={() => navigate('/login')}>Masuk</button></div>
        </div>

        <div className="rp-main">
          <h2 className="rp-title">Buat Akun Anggota</h2>

          {error && <div className="rp-error">{error}</div>}

          <form onSubmit={handleRegister} className="rp-form" noValidate>
            <div className="rp-grid">
              <div className="rp-field">
                <label>Nama</label>
                <input className="input" value={nama} onChange={(e) => setNama(e.target.value)} required />
              </div>

              <div className="rp-field">
                <label>Email</label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="rp-field">
                <label>Password</label>
                <input className="input" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <div className="rp-field">
                <label>No. HP</label>
                <input className="input" value={noHp} onChange={(e) => setNoHp(e.target.value)} />
              </div>

              <div className="rp-field rp-full">
                <label>Alamat</label>
                <input className="input" value={alamat} onChange={(e) => setAlamat(e.target.value)} />
              </div>

              <div className="rp-field">
                <label>Jabatan</label>
                <select className="input" value={jabatanId} onChange={(e) => setJabatanId(e.target.value)}>
                  {jabatanList.map((j) => (
                    <option key={j.id} value={j.id}>{j.nama}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="rp-actions">
              <button type="submit" className="btn" disabled={loading} aria-busy={loading}>
                {loading ? 'Memproses...' : 'Daftar & Masuk'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}