import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

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
    // ambil daftar jabatan dari backend
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
      // 1) register
      await api.post("/auth/register", {
        nama,
        email,
        password,
        alamat,
        no_hp: noHp,
        id_jabatan: jabatanId,
      });

      // 2) auto-login setelah register sukses
      const loginRes = await api.post("/auth/login", { email, password });
      const token = loginRes.data.access_token || loginRes.data.token || loginRes.data.accessToken;
      if (!token) throw new Error("Token tidak ditemukan pada response login");

      // simpan token
      localStorage.setItem("token", token);

      // optional: set global Authorization header (axios interceptor already handles localStorage)
      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // redirect ke anggota
      navigate("/anggota");
    } catch (err: any) {
      console.error("Register error:", err?.response?.data || err);
      const message = err?.response?.data?.message || (err?.message ?? "Gagal register");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Register Anggota</h2>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nama</label>
            <input value={nama} onChange={(e) => setNama(e.target.value)} required className="w-full p-3 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full p-3 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Alamat</label>
            <input value={alamat} onChange={(e) => setAlamat(e.target.value)} className="w-full p-3 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">No. HP</label>
            <input value={noHp} onChange={(e) => setNoHp(e.target.value)} className="w-full p-3 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Jabatan</label>
            <select value={jabatanId} onChange={(e) => setJabatanId(e.target.value)} className="w-full p-3 border rounded">
              {jabatanList.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nama}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded">
            {loading ? "Memproses..." : "Daftar & Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
