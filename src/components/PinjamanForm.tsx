import { useState } from "react";
import { pinjamanService } from "../services/pinjamanService";

export default function PinjamanForm({ onClose, onSuccess, edit }: any) {
  const [form, setForm] = useState({
    id_anggota: edit?.id_anggota || "",
    id_jangka_waktu: edit?.id_jangka_waktu || "",
    jumlah: edit?.jumlah || 0,
    tanggal: edit?.tanggal || "",
    tanggal_jatuh_tempo: edit?.tanggal_jatuh_tempo || "",
  });

  const submit = async () => {
    if (edit) {
    } else {
      await pinjamanService.create(form);
    }

    onSuccess();
    onClose();
  };

  return (
    <div style={{ padding: 20, border: "1px solid #aaa", marginTop: 20 }}>
      <h3>{edit ? "Edit Pinjaman" : "Tambah Pinjaman"}</h3>

      <input
        placeholder="ID Anggota"
        value={form.id_anggota}
        onChange={(e) => setForm({ ...form, id_anggota: e.target.value })}
      />
      <br />

      <input
        placeholder="ID Jangka Waktu"
        value={form.id_jangka_waktu}
        onChange={(e) => setForm({ ...form, id_jangka_waktu: e.target.value })}
      />
      <br />

      <input
        type="number"
        placeholder="Jumlah"
        value={form.jumlah}
        onChange={(e) => setForm({ ...form, jumlah: Number(e.target.value) })}
      />
      <br />

      <input
        type="date"
        value={form.tanggal}
        onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
      />
      <br />

      <input
        type="date"
        value={form.tanggal_jatuh_tempo}
        onChange={(e) =>
          setForm({ ...form, tanggal_jatuh_tempo: e.target.value })
        }
      />
      <br />

      <button onClick={submit}>Simpan</button>
      <button onClick={onClose}>Batal</button>
    </div>
  );
}
