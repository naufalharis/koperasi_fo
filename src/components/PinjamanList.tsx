import { useEffect, useState } from "react";
import { pinjamanService } from "../services/pinjamanService";
import PinjamanForm from "./PinjamanForm";
import PinjamanAngsuranForm from "./PinjamanAngsuranForm";

export default function PinjamanList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openAngsuran, setOpenAngsuran] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const res = await pinjamanService.list();
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const fmt = (s: string | null | undefined) => 
  s ? new Date(s).toLocaleString() : "-";

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Daftar Pinjaman</h2>
      <button onClick={() => setOpenForm(true)}>+ Tambah Pinjaman</button>

      <table border={1} cellPadding={10} style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Anggota</th>
            <th>Jumlah</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th>Jatuh Tempo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p: any) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.anggota?.nama ?? "-"}</td>
              <td>{p.jumlah.toLocaleString()}</td>
              <td>{p.status}</td>
              <td>{fmt(p.tanggal)}</td>
              <td>{fmt(p.tanggal_jatuh_tempo)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {openForm && (
        <PinjamanForm
          onClose={() => { setOpenForm(false); setEditData(null); }}
          onSuccess={loadData}
          edit={editData}
        />
      )}

      {openAngsuran && (
        <PinjamanAngsuranForm
          angsuran={openAngsuran}
          onClose={() => setOpenAngsuran(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
