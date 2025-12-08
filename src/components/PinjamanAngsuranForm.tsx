import { useState } from "react";
import { pinjamanService } from "../services/pinjamanService";

export default function PinjamanAngsuranForm({
  angsuran,
  onClose,
  onSuccess,
}: any) {
  const [jumlah, setJumlah] = useState(0);
  const [tanggal, setTanggal] = useState("");

  const submit = async () => {
    await pinjamanService.bayarAngsuran({
      id_angsuran: angsuran.id,
      jumlah_pembayaran: jumlah,
      tanggal_pembayaran: tanggal,
    });

    onSuccess();
    onClose();
  };

  return (
    <div style={{ padding: 20, border: "1px solid #aaa", marginTop: 20 }}>
      <h3>Bayar Angsuran</h3>

      <p>Sisa Pinjaman: {(angsuran?.sisa_pinjaman || 0).toLocaleString()}</p>

      <input
        type="number"
        placeholder="Jumlah Pembayaran"
        value={jumlah}
        onChange={(e) => setJumlah(Number(e.target.value))}
      />

      <input
        type="date"
        value={tanggal}
        onChange={(e) => setTanggal(e.target.value)}
      />

      <br />
      <button onClick={submit}>Bayar</button>
      <button onClick={onClose}>Batal</button>
    </div>
  );
}
