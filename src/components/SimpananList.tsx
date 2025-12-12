import React, { useEffect, useState } from "react";
import type { Simpanan } from "../services/simpananService";
import { simpananService } from "../services/simpananService";
import SimpananForm from "./SimpananForm";

export default function SimpananList() {
  const [simpanan, setSimpanan] = useState<Simpanan[]>([]);
  const [editing, setEditing] = useState<Simpanan | null>(null);

  const fetchData = async () => {
    const data = await simpananService.getAll();
    setSimpanan(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSoftDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;
    await simpananService.softDelete(id, "admin"); // ganti admin sesuai user login
    fetchData();
  };

  const handleForceDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus permanen kategori ini?")) return;
    await simpananService.forceDelete(id);
    fetchData();
  };

  return (
    <div>
      <SimpananForm
        onSuccess={fetchData}
        editing={editing}
        setEditing={setEditing}
      />

      <table border={1} style={{ marginTop: "1rem", width: "100%" }}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {simpanan.map((s) => (
            <tr key={s.id}>
              <td>{s.nama}</td>
              <td>
                <button onClick={() => setEditing(s)}>Edit</button>
                <button onClick={() => handleSoftDelete(s.id)}>Hapus</button>
                <button onClick={() => handleForceDelete(s.id)}>Hapus Permanen</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
