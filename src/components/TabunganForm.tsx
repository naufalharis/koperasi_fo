import React, { useEffect, useState } from "react";
import { api } from "../api/axios";
import { tabunganService } from "../services/tabunganService";

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

  // Load dropdown
  useEffect(() => {
    api.get("/auth/anggota").then((res) => setAnggotaList(res.data));
    api.get("/kategori-simpanan").then((res) => setKategoriList(res.data));
  }, []);

  // Auto-set form saat edit atau tambah
  useEffect(() => {
    if (editing && editing.id) {
      setForm({
        id_anggota: editing.id_anggota,
        id_kategori_simpanan: editing.id_kategori_simpanan,
        tanggal: editing.tanggal?.substring(0, 10) || "",
        jumlah: editing.jumlah,
        note: editing.note || "",
      });
    } else {
      setForm({
        id_anggota: "",
        id_kategori_simpanan: "",
        tanggal: "",
        jumlah: "",
        note: "",
      });
    }
  }, [editing]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="box" style={{ marginTop: 20 }}>
      <h3>{editing?.id ? "Edit Tabungan" : "Tambah Tabungan"}</h3>

      <label>Anggota</label>
      <select
        name="id_anggota"
        value={form.id_anggota}
        onChange={handleChange}
        required
      >
        <option value="">-- pilih anggota --</option>
        {anggotaList.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nama}
          </option>
        ))}
      </select>

      <label>Kategori Simpanan</label>
      <select
        name="id_kategori_simpanan"
        value={form.id_kategori_simpanan}
        onChange={handleChange}
        required
      >
        <option value="">-- pilih kategori --</option>
        {kategoriList.map((k) => (
          <option key={k.id} value={k.id}>
            {k.nama}
          </option>
        ))}
      </select>

      <label>Tanggal</label>
      <input
        type="date"
        name="tanggal"
        value={form.tanggal}
        onChange={handleChange}
        required
      />

      <label>Jumlah</label>
      <input
        type="number"
        name="jumlah"
        value={form.jumlah}
        onChange={handleChange}
        required
      />

      <br />
      <button type="submit" style={{ marginTop: 10 }}>
        {editing?.id ? "Update" : "Simpan"}
      </button>

      <button
        type="button"
        onClick={onCancel}
        style={{ marginLeft: 10 }}
      >
        Batal
      </button>
    </form>
  );
};

export default TabunganForm;
