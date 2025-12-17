// src/components/JabatanList.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import "./Jabatan.css";

interface Jabatan {
  id: string;
  nama: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  deleted_by?: string | null;
  created_by?: string | null;
}

export default function JabatanList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Jabatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI states
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showDeleted, setShowDeleted] = useState(false); // false = active, true = trash

  async function fetchJabatan(includeDeleted = false) {
  setLoading(true);
  setError(null);
  try {
    const res = await api.get("/jabatan", { params: { includeDeleted } });
    const payload = res.data?.data ?? res.data;
    setItems(Array.isArray(payload) ? payload : []);
  } catch (err: any) {
    console.error("Gagal ambil jabatan:", err);
    setError(err?.response?.data?.message || "Gagal mengambil daftar jabatan");
  } finally {
    setLoading(false);
  }
}

// panggil:
useEffect(() => {
  fetchJabatan(showDeleted);
}, [showDeleted]);


  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = items.filter((j) => (q ? j.nama.toLowerCase().includes(q) : true));
    return list;
  }, [items, search]);

  // split active / deleted
  const activeItems = filtered.filter((j) => !j.deleted_at);
  const deletedItems = filtered.filter((j) => !!j.deleted_at);

  const total = (showDeleted ? deletedItems.length : activeItems.length);
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const source = showDeleted ? deletedItems : activeItems;
  const pageData = source.slice((page - 1) * perPage, page * perPage);

  const fmtDate = (s?: string | null) => {
    if (!s) return "-";
    try {
      const d = new Date(s);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch {
      return s;
    }
  };

  // actions
  const handleSoftDelete = async (id: string) => {
    const ok = window.confirm("Yakin ingin menghapus (soft) jabatan ini?");
    if (!ok) return;
    try {
      await api.patch(`/jabatan/${id}/soft-delete`);
      await fetchJabatan();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Gagal menghapus jabatan");
    }
  };

  const handleRestore = async (id: string) => {
    const ok = window.confirm("Restore jabatan ini?");
    if (!ok) return;
    try {
      await api.patch(`/jabatan/${id}/restore`);
      await fetchJabatan();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Gagal restore jabatan");
    }
  };

  const handleHardDelete = async (id: string) => {
    const ok = window.confirm("Hapus permanen jabatan ini? Aksi ini tidak dapat dikembalikan.");
    if (!ok) return;
    try {
      await api.delete(`/jabatan/${id}`);
      await fetchJabatan();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Gagal menghapus permanen jabatan");
    }
  };

  // counts for tabs
  const activeCount = activeItems.length;
  const deletedCount = deletedItems.length;

  return (
    <div className="jb-root">
      <div className="jb-card">
        <div className="jb-header">
          <h3>Manajemen Jabatan</h3>

          <div className="jb-actions">
            <div className="jb-tabs" role="tablist" aria-label="Tabs">
              <button
                className={`jb-tab ${!showDeleted ? "active" : ""}`}
                onClick={() => { setShowDeleted(false); setPage(1); }}
              >
                Semua <span className="tab-count">{activeCount}</span>
              </button>
              <button
                className={`jb-tab ${showDeleted ? "active" : ""}`}
                onClick={() => { setShowDeleted(true); setPage(1); }}
              >
                Tong Sampah <span className="tab-count">{deletedCount}</span>
              </button>
            </div>

            <input
              className="jb-search"
              placeholder="Cari jabatan..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
              <option value={5}>5 / halaman</option>
              <option value={10}>10 / halaman</option>
              <option value={25}>25 / halaman</option>
            </select>
            {/* show create only when viewing active */}
            {!showDeleted && <button className="btn btn-primary" onClick={() => navigate("/jabatan/create")}>+ Jabatan</button>}
          </div>
        </div>

        {loading ? (
          <div className="jb-loading">Memuat...</div>
        ) : error ? (
          <div className="jb-error">{error}</div>
        ) : (
          <>
            <div className="jb-table">
              <div className="jb-head">
                <div className="col name">Nama Jabatan</div>
                <div className="col created">Dibuat</div>
                <div className="col status">Status</div>
                <div className="col actions">Aksi</div>
              </div>

              <div className="jb-body">
                {pageData.length === 0 ? (
                  <div className="jb-empty">Tidak ada data.</div>
                ) : (
                  pageData.map((j) => (
                    <div key={j.id} className={`jb-row ${j.deleted_at ? "muted" : ""}`}>
                      <div className="col name">{j.nama}</div>
                      <div className="col created">{fmtDate(j.created_at ?? j.updated_at ?? null)}</div>
                      <div className="col status">
                        {j.deleted_at ? <span className="badge badge-deleted">Dihapus</span> : <span className="badge badge-active">Aktif</span>}
                      </div>

                      <div className="col actions">
                        {!showDeleted ? (
                          <>
                            <button className="btn" onClick={() => navigate(`/jabatan/${j.id}`)}>Lihat</button>
                            <button className="btn" onClick={() => navigate(`/jabatan/${j.id}/edit`)}>Edit</button>
                            <button className="btn danger" onClick={() => handleSoftDelete(j.id)}>Hapus</button>
                          </>
                        ) : (
                          <>
                            <button className="btn" onClick={() => handleRestore(j.id)}>Restore</button>
                            <button className="btn danger" onClick={() => handleHardDelete(j.id)}>Hapus Permanen</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="jb-footer">
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
