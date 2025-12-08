// src/components/KasList.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import "./Kas.css";

interface Kas {
  id: string;
  nominal: number;
  tanggal: string;
  note?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  created_by?: string | null;
  deleted_by?: string | null;
}

export default function KasList() {
  const navigate = useNavigate();
  const [data, setData] = useState<Kas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [from, setFrom] = useState<string | undefined>(undefined);
  const [to, setTo] = useState<string | undefined>(undefined);

  async function fetchKas() {
    setLoading(true);
    setError(null);
    try {
      // backend supports query params (page/perPage/from/to) — safe to pass
      const res = await api.get("/kas", {
        params: {
          page,
          perPage,
          from,
          to,
        },
      });
      // try to accept both { data, meta } or plain array
      if (Array.isArray(res.data)) {
        setData(res.data);
      } else if (res.data?.data) {
        setData(res.data.data);
      } else {
        // fallback if server returns top-level array or object
        const arr = Array.isArray(res.data) ? res.data : res.data;
        setData(arr ?? []);
      }
    } catch (err: any) {
      console.error("Gagal ambil kas:", err);
      setError(err?.response?.data?.message || "Gagal mengambil data kas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchKas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, from, to]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (k) =>
        String(k.nominal).toLowerCase().includes(q) ||
        (k.note ?? "").toLowerCase().includes(q) ||
        (k.created_by ?? "").toLowerCase().includes(q)
    );
  }, [data, search]);

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const fmtCurrency = (n?: number) =>
    typeof n === "number" ? n.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }) : "-";
  const fmtDate = (s?: string | null) => (s ? new Date(s).toLocaleString() : "-");

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Hapus kas ini? (action akan menghapus record)");
    if (!ok) return;
    try {
      await api.delete(`/kas/${id}`);
      await fetchKas();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Gagal menghapus");
    }
  };

  const handleRestore = async (id: string) => {
    const ok = window.confirm("Restore record ini ?");
    if (!ok) return;
    try {
      await api.post(`/kas/${id}/restore`);
      await fetchKas();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Gagal restore");
    }
  };

  return (
    <div className="kas-root">
      <div className="kas-card">
        <div className="kas-header">
          <h3>Kas Koperasi</h3>

          <div className="kas-actions">
            <div className="kas-filters">
              <input
                placeholder="Cari nominal / note / user..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                aria-label="Cari kas"
              />

              <input
                type="date"
                value={from ?? ""}
                onChange={(e) => { setFrom(e.target.value || undefined); setPage(1); }}
                title="Dari tanggal"
              />
              <input
                type="date"
                value={to ?? ""}
                onChange={(e) => { setTo(e.target.value || undefined); setPage(1); }}
                title="Sampai tanggal"
              />

              <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                <option value={5}>5 / halaman</option>
                <option value={10}>10 / halaman</option>
                <option value={25}>25 / halaman</option>
              </select>
            </div>

            <div>
              <button className="btn btn-primary" onClick={() => navigate("/kas/create")}>+ Tambah Kas</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="kas-loading">Memuat...</div>
        ) : error ? (
          <div className="kas-error">{error}</div>
        ) : (
          <>
            <div className="kas-table">
              <div className="kas-head">
                <div className="col nom">Nominal</div>
                <div className="col tgl">Tanggal</div>
                <div className="col note">Keterangan</div>
                <div className="col by">Dibuat oleh</div>
                <div className="col created">Dibuat</div>
                <div className="col actions">Aksi</div>
              </div>

              <div className="kas-body">
                {pageData.length === 0 ? (
                  <div className="kas-empty">Tidak ada data kas.</div>
                ) : (
                  pageData.map((k) => (
                    <div key={k.id} className={`kas-row ${k.deleted_at ? "muted" : ""}`}>
                      <div className="col nom">{fmtCurrency(k.nominal)}</div>
                      <div className="col tgl">{fmtDate(k.tanggal)}</div>
                      <div className="col note">{k.note ?? "-"}</div>
                      <div className="col by">{k.created_by ?? "-"}</div>
                      <div className="col created">{fmtDate(k.created_at)}</div>
                      <div className="col actions">
                        <button className="btn" onClick={() => navigate(`/kas/${k.id}`)}>Lihat</button>
                        <button className="btn" onClick={() => navigate(`/kas/${k.id}/edit`)}>Edit</button>
                        {k.deleted_at ? (
                          <button className="btn small" onClick={() => handleRestore(k.id)}>Restore</button>
                        ) : (
                          <button className="btn danger" onClick={() => handleDelete(k.id)}>Hapus</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="kas-footer">
              <div className="meta">
                Menampilkan {Math.min((page - 1) * perPage + 1, total)} - {Math.min(page * perPage, total)} dari {total}
              </div>
              <div className="pager">
                <button onClick={() => setPage(1)} disabled={page === 1}>«</button>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                <span>Hal {page} / {lastPage}</span>
                <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page === lastPage}>›</button>
                <button onClick={() => setPage(lastPage)} disabled={page === lastPage}>»</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
