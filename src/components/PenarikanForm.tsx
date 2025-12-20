// src/components/PenarikanForm.tsx
import React, { useEffect, useState } from "react";
import { penarikanService } from "../services/penarikanService";
import { tabunganService } from "../services/tabunganService"; // pakai untuk refresh atau fetch if needed
import "./Tabungan.css";

interface Props {
  tabungan?: {
    id: string;
    id_anggota: string;
    jumlah: number;
    anggota?: { id: string; nama?: string };
  } | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function PenarikanForm({ tabungan = null, onCancel, onSuccess }: Props) {
  const [jumlah, setJumlah] = useState<number | "">("");
  const [tanggal, setTanggal] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tabungan) {
      setJumlah("");
    }
  }, [tabungan]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!tabungan) {
      setError("Pilih tabungan terlebih dahulu");
      return;
    }
    const v = Number(jumlah);
    if (!v || v <= 0) {
      setError("Jumlah penarikan harus lebih dari 0");
      return;
    }
    if (v > (tabungan.jumlah ?? 0)) {
      setError("Saldo tidak mencukupi");
      return;
    }

    setLoading(true);
    try {
      await penarikanService.create({
        id_anggota: tabungan.id_anggota,
        id_tabungan: tabungan.id,
        tanggal: new Date(tanggal).toISOString(),
        jumlah: v,
      });
      // sukses -> callback
      onSuccess();
    } catch (err: any) {
      console.error("Penarikan error:", err);
      setError(err?.response?.data?.message || err?.message || "Gagal melakukan penarikan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tg-form-card" style={{ maxWidth: 720 }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h4 style={{ margin: 0 }}>Penarikan</h4>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Memproses..." : "Tarik"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="tg-field">
            <label className="sm-label">Anggota</label>
            <input className="input" value={tabungan?.anggota?.nama ?? "-"} readOnly />
          </div>

          <div className="tg-field">
            <label className="sm-label">Saldo Saat Ini</label>
            <input className="input" value={typeof tabungan?.jumlah === "number" ? tabungan.jumlah.toLocaleString("id-ID") : "-"} readOnly />
          </div>

          <div className="tg-field">
            <label className="sm-label">Tanggal</label>
            <input className="input" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
          </div>

          <div className="tg-field">
            <label className="sm-label">Jumlah Penarikan</label>
            <input
              className="input"
              type="number"
              min={0}
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="Masukkan jumlah (Rp)"
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            {error && <div className="tg-empty" style={{ background: "#fff1f0", color: "#7f1d1d" }}>{error}</div>}
          </div>
        </div>
      </form>
    </div>
  );
}
