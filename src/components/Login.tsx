// src/components/Login.tsx
import { useEffect, useRef, useState } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";
import "./Login.css"; // <- pastikan path benar

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    emailRef.current?.focus();
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      setEmail(remembered);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Email dan password harus diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.access_token || res.data.token || res.data.accessToken;
      if (!token) throw new Error("Token tidak ditemukan.");

      localStorage.setItem("token", token);
      if (remember) localStorage.setItem("rememberedEmail", email);
      else localStorage.removeItem("rememberedEmail");

      // set header immediately
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // redirect
      window.location.href = "/anggota";
    } catch (err: any) {
      console.error("LOGIN ERROR:", err?.response?.data || err);
      const msg = err?.response?.data?.message || err?.message || "Login gagal — periksa kredensial";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-container">
        <aside className="login-left">
          <div className="brand">
            <h1>KoperasiKU</h1>
            <p>Kelola anggota, kas, dan pinjaman dengan mudah.</p>
          </div>

  <div className="benefits">
  <h2>Keunggulan Koperasi</h2>
  <ul>
    <li>
      <strong>Kepemilikan dan Pengelolaan Bersama</strong> — Koperasi berdiri 
      atas asas kebersamaan, di mana setiap anggota memiliki hak suara yang 
      setara dalam pengambilan keputusan. Tidak ada pihak yang mendominasi, 
      sehingga semua kebijakan benar-benar mencerminkan kebutuhan dan aspirasi 
      anggota. Model ini menciptakan lingkungan yang lebih demokratis dan 
      berkeadilan.
    </li>

    <li>
      <strong>Pembagian Keuntungan yang Adil</strong> — Sisa Hasil Usaha (SHU) 
      dibagikan kembali kepada anggota berdasarkan kontribusi mereka, bukan 
      berdasarkan modal terbesar. Ini membuat koperasi menjadi lembaga yang 
      fokus pada kesejahteraan anggota, bukan mencari keuntungan sepihak, dan 
      meningkatkan rasa memiliki di antara seluruh anggota.
    </li>

    <li>
      <strong>Akses Ekonomi yang Lebih Mudah</strong> — Melalui layanan simpan 
      pinjam, pembiayaan usaha kecil, hingga penyediaan kebutuhan pokok, 
      koperasi memberi peluang ekonomi yang lebih terjangkau bagi anggotanya. 
      Hal ini membantu meningkatkan kemandirian finansial serta memperluas 
      kesempatan bagi anggota untuk berkembang.
    </li>

    <li>
      <strong>Transparansi dan Akuntabilitas Tinggi</strong> — Seluruh kegiatan 
      operasional, mulai dari transaksi, pembukuan, hingga laporan keuangan, 
      dilakukan secara terbuka dan dapat dipantau oleh seluruh anggota. Prinsip 
      ini menciptakan kepercayaan kuat, mencegah penyalahgunaan kewenangan, dan 
      memastikan koperasi berjalan dengan jujur serta profesional.
    </li>
  </ul>
</div>

        </aside>

        <main className="login-card" aria-live="polite">
          <div className="card-header">
            <div>
              <h2>Selamat datang</h2>
              <p className="muted">Masuk untuk mengelola koperasi</p>
            </div>
            <div className="version">v1.0</div>
          </div>

          {error && <div className="alert error" role="alert">{error}</div>}

          <form className="login-form" onSubmit={handleLogin}>
            <label className="field">
              <span className="label">Email</span>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="contoh@domain.com"
                className="input"
              />
            </label>

            <label className="field">
              <span className="label">Password</span>
              <div className="password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Masukkan password"
                  className="input"
                />
                <button
                  type="button"
                  className="btn-inline"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>
            </label>

            <div className="row-between">
              <label className="checkbox-label">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span>Ingat saya</span>
              </label>
              <Link className="link-muted" to="/forgot">Lupa password?</Link>
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? (
                <span className="spinner" aria-hidden />
              ) : (
                "Masuk"
              )}
            </button>

            <div className="divider"><span>atau</span></div>

            <div className="socials">
              <button type="button" className="btn-social" onClick={() => alert("Social login belum aktif")}>Google</button>
              <button type="button" className="btn-social" onClick={() => alert("Social login belum aktif")}>GitHub</button>
            </div>

            <div className="signup">
              Belum punya akun? <Link to="/register" className="link-primary">Daftar sekarang</Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
