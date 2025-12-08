// src/components/RegisterPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

interface Jabatan {
  id: string;
  nama: string;
}

type FieldErrors = Partial<Record<"nama" | "email" | "password" | "noHp" | "jabatan", string>>;

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noHp, setNoHp] = useState("");
  const [jabatanId, setJabatanId] = useState<string | undefined>(undefined);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [jabatanLoading, setJabatanLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // password UX
  const [showPassword, setShowPassword] = useState(false);
  const [pwScore, setPwScore] = useState(0);
  const [pwLabel, setPwLabel] = useState(" ");

  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement | null>(null);

  // focus first input on mount
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // fetch jabatan with skeleton handling
  useEffect(() => {
    let mounted = true;
    async function fetchJabatan() {
      setJabatanLoading(true);
      try {
        const res = await api.get<Jabatan[]>("/jabatan");
        if (!mounted) return;
        setJabatanList(res.data);
        if (res.data.length > 0) setJabatanId((prev) => prev ?? res.data[0].id);
      } catch (err) {
        console.error("Gagal fetch jabatan:", err);
        // show non-blocking message but allow registration (user must choose)
      } finally {
        if (mounted) setJabatanLoading(false);
      }
    }
    fetchJabatan();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // password strength util
  useEffect(() => {
    const calc = calcPasswordStrength(password);
    setPwScore(calc.score);
    setPwLabel(calc.label);
  }, [password]);

  function calcPasswordStrength(pw: string) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const label = score === 0 ? "Terlalu pendek" : score === 1 ? "Lemah" : score === 2 ? "Cukup" : score === 3 ? "Baik" : "Kuat";
    return { score, label };
  }

  // client-side validation
  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (!nama.trim()) e.nama = "Nama wajib diisi";
    if (!email.trim()) e.email = "Email wajib diisi";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Format email tidak valid";
    if (!password) e.password = "Password wajib diisi";
    else if (password.length < 6) e.password = "Password minimal 6 karakter";
    if (!jabatanId) e.jabatan = "Pilih jabatan terlebih dahulu";
    if (noHp && !/^\+?\d{6,15}$/.test(noHp)) e.noHp = "Format no. HP tidak valid (contoh: +6281234567890)";
    return e;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    const eObj = validate();
    setFieldErrors(eObj);
    if (Object.keys(eObj).length) return;

    setLoading(true);
    try {
      // register
      await api.post("/auth/register", {
        nama,
        email,
        password,
        alamat,
        no_hp: noHp,
        id_jabatan: jabatanId,
      });

      // auto-login
      const loginRes = await api.post("/auth/login", { email, password });
      const token = loginRes.data.access_token || loginRes.data.token || loginRes.data.accessToken;
      if (!token) throw new Error("Token tidak ditemukan pada response login");

      localStorage.setItem("token", token);
      // set global axios header immediately (optional)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // redirect to anggota/dashboard
      navigate("/anggota");
    } catch (err: any) {
      console.error("Register error:", err?.response?.data || err);
      const serverMsg = err?.response?.data?.message;
      if (typeof serverMsg === "object" && serverMsg !== null) {
        // possibly validation object from backend
        // flatten first-level keys if present
        const newFieldErrors: FieldErrors = {};
        for (const k in serverMsg) {
          if (k === "email" || k === "password" || k === "nama" || k === "no_hp") {
            // map server field names if needed
            newFieldErrors[k === "no_hp" ? "noHp" : (k as keyof FieldErrors)] = serverMsg[k];
          }
        }
        setFieldErrors((prev) => ({ ...prev, ...newFieldErrors }));
        if (!Object.keys(newFieldErrors).length) setGlobalError("Gagal register — periksa input.");
      } else {
        const message = serverMsg || err?.message || "Gagal register";
        setGlobalError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-root">
      <div className="rp-card">
        {/* Aside */}
        <div className="rp-aside" aria-hidden>
          <div className="rp-brand">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.2" />
              <path d="M7 12h10M7 7h10M7 17h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <h1>Kooperasi</h1>
          </div>

          <p className="rp-desc">Daftar sebagai anggota — akses koleksi, peminjaman, dan riwayat.</p>

          <div className="rp-illustration" aria-hidden>
            <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false">
              <rect x="0" y="20" width="80" height="110" rx="6" />
              <rect x="90" y="30" width="120" height="90" rx="6" />
            </svg>
          </div>

          <div className="rp-footer-note">
            Sudah punya akun?{" "}
            <button className="rp-link" onClick={() => navigate("/login")}>
              Masuk
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="rp-main">
          <h2 className="rp-title">Buat Akun Anggota</h2>

          {globalError && <div className="rp-error" role="alert">{globalError}</div>}

          <form onSubmit={handleRegister} className="rp-form" noValidate>
            <div className="rp-grid">
              <div className="rp-field">
                <label htmlFor="nama">Nama</label>
                <input
                  id="nama"
                  ref={nameRef}
                  className="input"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  aria-invalid={!!fieldErrors.nama}
                  aria-describedby={fieldErrors.nama ? "err-nama" : undefined}
                  required
                />
                {fieldErrors.nama && <div id="err-nama" className="rp-field-error" role="alert">{fieldErrors.nama}</div>}
              </div>

              <div className="rp-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "err-email" : undefined}
                  required
                />
                {fieldErrors.email && <div id="err-email" className="rp-field-error" role="alert">{fieldErrors.email}</div>}
              </div>

              <div className="rp-field">
                <label htmlFor="password">Password</label>
                <div className="password-wrap">
                  <input
                    id="password"
                    className="input"
                    type={showPassword ? "text" : "password"}
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "err-password" : "pw-help"}
                    required
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

                {fieldErrors.password && <div id="err-password" className="rp-field-error" role="alert">{fieldErrors.password}</div>}

                <div id="pw-help" className="pw-strength" aria-hidden>
                  <div className="pw-bars">
                    <div className={`bar ${pwScore >= 1 ? "on" : ""}`} />
                    <div className={`bar ${pwScore >= 2 ? "on" : ""}`} />
                    <div className={`bar ${pwScore >= 3 ? "on" : ""}`} />
                    <div className={`bar ${pwScore >= 4 ? "on" : ""}`} />
                  </div>
                  <div className="pw-label">{pwLabel}</div>
                </div>
              </div>

              <div className="rp-field">
                <label htmlFor="nohp">No. HP</label>
                <input
                  id="nohp"
                  className="input"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  placeholder="+62 812 3456 7890"
                  inputMode="tel"
                  aria-invalid={!!fieldErrors.noHp}
                  aria-describedby={fieldErrors.noHp ? "err-nohp" : undefined}
                />
                {fieldErrors.noHp && <div id="err-nohp" className="rp-field-error" role="alert">{fieldErrors.noHp}</div>}
              </div>

              <div className="rp-field rp-full">
                <label htmlFor="alamat">Alamat</label>
                <input id="alamat" className="input" value={alamat} onChange={(e) => setAlamat(e.target.value)} />
              </div>

              <div className="rp-field">
                <label htmlFor="jabatan">Jabatan</label>

                {jabatanLoading ? (
                  <div className="skeleton-select" role="status" aria-live="polite">Memuat jabatan...</div>
                ) : (
                  <>
                    <select
                      id="jabatan"
                      className="input"
                      value={jabatanId}
                      onChange={(e) => setJabatanId(e.target.value)}
                      aria-invalid={!!fieldErrors.jabatan}
                      aria-describedby={fieldErrors.jabatan ? "err-jabatan" : undefined}
                    >
                      <option value="">-- Pilih jabatan --</option>
                      {jabatanList.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.nama}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.jabatan && <div id="err-jabatan" className="rp-field-error" role="alert">{fieldErrors.jabatan}</div>}
                  </>
                )}
              </div>
            </div>

            <div className="rp-actions">
              <button type="submit" className="btn" disabled={loading} aria-busy={loading}>
                {loading ? "Memproses..." : "Daftar & Masuk"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
