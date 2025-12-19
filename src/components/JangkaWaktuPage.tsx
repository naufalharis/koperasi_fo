import { useEffect, useState } from "react";
import { kategoriJangkaWaktuApi } from "../api/JangkaWaktuApi";
import type { KategoriJangkaWaktu } from "../types/JangkaWaktu";
import KategoriJangkaWaktuForm from "../components/JangkaWaktuForm";
import KategoriJangkaWaktuTable from "../components/JangkaWaktuTable";
import "../components/JangkaWaktu.css";

export default function KategoriJangkaWaktuPage() {
  const [data, setData] = useState<KategoriJangkaWaktu[]>([]);
  const [editing, setEditing] = useState<KategoriJangkaWaktu | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadData = async () => {
    const res = await kategoriJangkaWaktuApi.getAll();
    setData(res);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (payload: { nama: string }) => {
    await kategoriJangkaWaktuApi.create(payload);
    setShowForm(false);
    loadData();
  };

  const handleUpdate = async (payload: { nama: string }) => {
    if (!editing) return;
    await kategoriJangkaWaktuApi.update(editing.id, payload);
    setEditing(null);
    setShowForm(false);
    loadData();
  };

  const handleSoftDelete = async (id: string) => {
    if (!confirm("Soft delete data ini?")) return;
    await kategoriJangkaWaktuApi.softDelete(id);
    loadData();
  };

  const handleHardDelete = async (id: string) => {
    if (!confirm("HARD DELETE? Data akan hilang permanen")) return;
    await kategoriJangkaWaktuApi.hardDelete(id);
    loadData();
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Kategori Jangka Waktu</h2>

      <button className="btn btn-primary" onClick={() => {
        setEditing(null);
        setShowForm(true);
      }}>
        + Tambah Data
      </button>

      {showForm && (
        <KategoriJangkaWaktuForm
          initialValue={editing ? { nama: editing.nama } : undefined}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => {
            setEditing(null);
            setShowForm(false);
          }}
        />
      )}

      <KategoriJangkaWaktuTable
        data={data}
        onEdit={(item) => {
          setEditing(item);
          setShowForm(true);
        }}
        onSoftDelete={handleSoftDelete}
        onHardDelete={handleHardDelete}
      />
    </div>
  );
}
