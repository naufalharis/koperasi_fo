import React, { useState, useEffect } from "react";
import { angsuranService } from "../services/angsuranService";
import { api } from "../api/axios";

interface Props {
  editing?: any;
  onSuccess: () => void;
}

const AngsuranForm: React.FC<Props> = ({ editing, onSuccess }) => {
  const [pinjamanList, setPinjamanList] = useState<any[]>([]);

  // ← gunakan string dulu
  const [pinjaman_id, setPinjamanId] = useState<string>(
    editing?.pinjaman_id ? String(editing.pinjaman_id) : ""
  );

  const [tanggal_pembayaran, setTanggal] = useState<string>(
    editing?.tanggal_pembayaran?.substring(0, 10) || ""
  );

  const [jumlah_pembayaran, setJumlah] = useState<number>(
    editing?.jumlah_pembayaran || 0
  );

  useEffect(() => {
    api.get("/pinjaman").then((res) => setPinjamanList(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pinjaman_id) {
      alert("Harap pilih pinjaman!");
      return;
    }

    const payload = {
      pinjaman_id: Number(pinjaman_id), // ← convert aman
      tanggal_pembayaran: new Date(tanggal_pembayaran).toISOString(),
      jumlah_pembayaran: Number(jumlah_pembayaran),
    };

    console.log("PAYLOAD DIKIRIM:", payload);

    if (editing) {
      await angsuranService.update(editing.id, payload);
    } else {
      await angsuranService.create(payload);
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Pinjaman</label>
      <select
        value={pinjaman_id}
        onChange={(e) => setPinjamanId(e.target.value)}
        required
      >
        <option value="">-- pilih pinjaman --</option>
        {pinjamanList.map((p) => (
          <option key={p.id} value={String(p.id)}>
            {p.id} - Rp {p.jumlah.toLocaleString()}
          </option>
        ))}
      </select>

      <label>Tanggal Pembayaran</label>
      <input
        type="date"
        value={tanggal_pembayaran}
        onChange={(e) => setTanggal(e.target.value)}
        required
      />

      <label>Jumlah Pembayaran</label>
      <input
        type="number"
        value={jumlah_pembayaran}
        onChange={(e) => setJumlah(Number(e.target.value))}
        required
      />

      <button type="submit">
        {editing ? "Update Angsuran" : "Tambah Angsuran"}
      </button>
    </form>
  );
};

export default AngsuranForm;
