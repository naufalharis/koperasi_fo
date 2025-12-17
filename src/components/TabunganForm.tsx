import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { tabunganService } from "../services/tabunganService";
import "./Tabungan.css";

interface Props {
  editing: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const TabunganForm: React.FC<Props> = ({ editing, onSuccess, onCancel }) => {
  const [anggotaList, setAnggotaList] = useState<any[]>([]);
  const [kategoriList, setKategoriList] = useState<any[]>([]);

  const [form, setForm] = useState({
    id_anggota: "",
    id_kategori_simpanan: "",
    tanggal: "",
    jumlah: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);

  // Load dropdowns
  useEffect(() => {
    api.get("/auth/anggota").then((res) => setAnggotaList(res.data || []));
    api.get("/kategori-simpanan").then((res) => setKategoriList(res.data || []));
  }, []);

  // Auto-set form saat edit atau tambah
  useEffect(() => {
    if (editing && editing.id) {
      setForm({
        id_anggota: editing.id_anggota ?? "",
        id_kategori_simpanan: editing.id_kategori_simpanan ?? "",
        tanggal: editing.tanggal?.substring(0, 10) || "",
        jumlah: editing.jumlah ?? "",
        note: editing.note ?? "",
      });
    } else {
      setForm({
        id_anggota: "",
        id_kategori_simpanan: "",
        tanggal: new Date().toISOString().slice(0, 10),
        jumlah: "",
        note: "",
      });
    }
  }, [editing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // basic validation
    if (!form.id_anggota || !form.id_kategori_simpanan || !form.tanggal || !form.jumlah) {
      alert("Lengkapi semua field wajib");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      jumlah: Number(form.jumlah),
      tanggal: new Date(form.tanggal).toISOString(),
    };

    try {
      if (editing?.id) {
        await tabunganService.update(editing.id, payload);
      } else {
        await tabunganService.create(payload);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan tabungan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tg-form-card">
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h4 style={{ margin: 0 }}>{editing?.id ? "Edit Tabungan" : "Tambah Tabungan"}</h4>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</button>
          </div>
        </div>

        <div className="tg-form-grid">
          <div className="tg-field">
            <label>Anggota</label>
            <select name="id_anggota" value={form.id_anggota} onChange={handleChange} required>
              <option value="">-- pilih anggota --</option>
              {anggotaList.map((a) => (<option key={a.id} value={a.id}>{a.nama}</option>))}
            </select>
          </div>

          <div className="tg-field">
            <label>Kategori Simpanan</label>
            <select name="id_kategori_simpanan" value={form.id_kategori_simpanan} onChange={handleChange} required>
              <option value="">-- pilih kategori --</option>
              {kategoriList.map((k) => (<option key={k.id} value={k.id}>{k.nama}</option>))}
            </select>
          </div>

          <div className="tg-field">
            <label>Tanggal</label>
            <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} required />
          </div>

          <div className="tg-field">
            <label>Jumlah</label>
            <input type="number" name="jumlah" value={form.jumlah} onChange={handleChange} required />
          </div>

          <div className="tg-field" style={{ gridColumn: "1 / -1" }}>
            <label>Keterangan (optional)</label>
            <textarea name="note" value={form.note} onChange={handleChange} rows={3} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TabunganForm;
