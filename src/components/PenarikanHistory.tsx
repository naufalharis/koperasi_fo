// src/components/PenarikanHistory.tsx
import React, { useEffect, useMemo, useState } from "react";
import { penarikanService } from "../services/penarikanService";
import type { Penarikan } from "../services/penarikanService";
// import "./Penarikan.css"; // opsional: styling

interface Props {
  anggotaId: string;
  initialLoad?: boolean; // default true
  pageSize?: number;
}

const fmtCurrency = (n?: number) =>
  typeof n === "number"
    ? n.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    : "-";

const fmtDate = (s?: string) => (s ? new Date(s).toLocaleString() : "-");

export default function PenarikanHistory({ anggotaId, initialLoad = true, pageSize = 10 }: Props) {
  const [items, setItems] = useState<Penarikan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await penarikanService.getByAnggota(anggotaId);
      setItems(Array.isArray(res) ? res : []);
    } catch (err: any) {
      console.error("Gagal ambil penarikan:", err);
      setError(err?.response?.data?.message || err?.message || "Gagal memuat riwayat penarikan");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialLoad && anggotaId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anggotaId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        (i.tabungan?.id ?? "").toLowerCase().includes(q) ||
        (i.anggota?.nama ?? "").toLowerCase().includes(q) ||
        String(i.jumlah).toLowerCase().includes(q) ||
        fmtDate(i.tanggal).toLowerCase().includes(q)
    );
  }, [items, search]);

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="ph-root" style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <h4 style={{ margin: 0 }}>Riwayat Penarikan</h4>
          <div style={{ color: "#6b7280", fontSize: 13 }}>Riwayat tarik tunai anggota ini</div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            placeholder="Cari nominal / tanggal / tabungan..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e6e9ef", minWidth: 200 }}
          />
          <button className="btn" onClick={load} disabled={loading}>
            {loading ? "Memuat..." : "Refresh"}
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 10, padding: 12, boxShadow: "0 6px 20px rgba(17,24,39,0.04)" }}>
        {loading ? (
          <div style={{ padding: 20 }}>Memuat...</div>
        ) : error ? (
          <div style={{ padding: 12, color: "crimson" }}>{error}</div>
        ) : pageData.length === 0 ? (
          <div style={{ padding: 20, color: "#6b7280" }}>Belum ada penarikan untuk anggota ini.</div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#374151", fontSize: 13 }}>
                    <th style={{ padding: "8px 12px" }}>ID</th>
                    <th style={{ padding: "8px 12px" }}>Tanggal</th>
                    <th style={{ padding: "8px 12px", textAlign: "right" }}>Jumlah</th>
                    <th style={{ padding: "8px 12px" }}>Tabungan</th>
                    <th style={{ padding: "8px 12px" }}>Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((p) => (
                    <tr key={p.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px 12px", whiteSpace: "nowrap", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>{p.id}</td>
                      <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>{fmtDate(p.tanggal)}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>{fmtCurrency(p.jumlah)}</td>
                      <td style={{ padding: "10px 12px" }}>{p.tabungan?.id ?? "-"}</td>
                      <td style={{ padding: "10px 12px" }}>{/* kalau server sediakan note / bisa tampilkan */ "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <div style={{ color: "#6b7280" }}>Menampilkan {Math.min((page - 1) * pageSize + 1, total)} - {Math.min(page * pageSize, total)} dari {total}</div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button className="btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
                <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                <span style={{ minWidth: 100, textAlign: "center" }}>Hal {page} / {lastPage}</span>
                <button className="btn" onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page === lastPage}>›</button>
                <button className="btn" onClick={() => setPage(lastPage)} disabled={page === lastPage}>»</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
