// src/components/PenarikanList.tsx
import React, { useEffect, useState } from "react";
import { penarikanService } from "../services/penarikanService";
import type { Penarikan } from "../services/penarikanService";
import "./Tabungan.css";

export default function PenarikanList() {
  const [data, setData] = useState<Penarikan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await penarikanService.getAll();
      setData(res ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Gagal mengambil data penarikan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const fmtDate = (s?: string) => s ? new Date(s).toLocaleString() : "-";
  const fmtCurrency = (n?: number) => typeof n === "number" ? n.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }) : "-";

  return (
    <div className="tg-root">
      <div className="tg-card">
        <div className="tg-header">
          <div>
            <h2 className="tg-title">Riwayat Penarikan</h2>
            <div className="tg-sub">Daftar semua penarikan dari tabungan anggota</div>
          </div>
          <div className="tg-controls">
            <button className="btn" onClick={load}>Refresh</button>
          </div>
        </div>

        <div className="tg-body">
          {loading ? <div className="tg-empty">Memuat...</div> : error ? <div className="tg-empty">{error}</div> : (
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Anggota</th>
                    <th>Tanggal</th>
                    <th>Jumlah</th>
                    <th>Tabungan</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr><td colSpan={5} className="tg-empty">Belum ada penarikan</td></tr>
                  ) : data.map((p) => (
                    <tr key={p.id}>
                      <td style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.id}</td>
                      <td>{p.anggota?.nama ?? "-"}</td>
                      <td>{fmtDate(p.tanggal)}</td>
                      <td>{fmtCurrency(p.jumlah)}</td>
                      <td>{p.tabungan?.id ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
