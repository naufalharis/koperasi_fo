import { useEffect, useState } from "react";
import {api} from "../api/axios";

interface Anggota {
  id: string;
  nama: string;
  deleted_at: string | null;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  email: string;
}

export default function AnggotaList() {
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnggota = async () => {
    try {
      const res = await api.get<Anggota[]>("/auth/anggota");
      setAnggota(res.data);
    } catch (error) {
      console.error("Error fetching anggota:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnggota();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Daftar Anggota</h2>

      {anggota.length === 0 ? (
        <p>Tidak ada data.</p>
      ) : (
        <table border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Dibuat</th>
              <th>Diperbarui</th>
            </tr>
          </thead>
          <tbody>
            {anggota.map((a) => (
              <tr key={a.id}>
                <td>{a.nama}</td>
                <td>{a.email}</td>
                <td>{a.created_at}</td>
                <td>{a.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
