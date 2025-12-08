// src/components/AnggotaList.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import "./AnggotaList.css";

interface Anggota {
  id: string;
  nama: string;
  email: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  updated_by: string | null;
}

export default function AnggotaList() {
  const navigate = useNavigate();
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"nama" | "email" | "created_at">("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchAnggota = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Anggota[]>("/auth/anggota");
      setAnggota(res.data);
    } catch (err: any) {
      console.error("Error fetching anggota:", err);
      setError(err?.response?.data?.message || "Gagal mengambil data anggota");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnggota();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // client-side search + sort
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = anggota.slice();

    if (q) {
      list = list.filter(
        (a) =>
          a.nama.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let A: string | number = (a as any)[sortBy] ?? "";
      let B: string | number = (b as any)[sortBy] ?? "";
      if (sortBy === "created_at") {
        A = new Date(a.created_at).getTime();
        B = new Date(b.created_at).getTime();
      } else {
        A = String(A).toLowerCase();
        B = String(B).toLowerCase();
      }
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [anggota, search, sortBy, sortDir]);

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  // helpers
  const fmt = (s?: string | null) => (s ? new Date(s).toLocaleString() : "-");

  // delete handler (calls backend DELETE /auth/anggota/:id)
  const handleDelete = async (id: string) => {
    const ok = window.confirm("Hapus anggota ini? Aksi tidak bisa dibatalkan.");
    if (!ok) return;
    try {
      await api.delete(`/auth/anggota/${id}`);
      // refetch
      await fetchAnggota();
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err?.response?.data?.message || "Gagal menghapus anggota");
    }
  };

  // optional: client-side quick toggle sort direction
  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  return (
    <div className="al-root">
      <div className="al-card">
        <div className="al-header">
          <h3>Daftar Anggota</h3>

          <div className="al-controls">
            <div className="al-search">
              <input
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                aria-label="Cari anggota"
              />
            </div>

            <div className="al-selects">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="created_at">Terbaru</option>
                <option value="nama">Nama</option>
                <option value="email">Email</option>
              </select>

              <button
                className="al-sort-btn"
                onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                aria-label="Toggle sort direction"
                title={`Urut: ${sortDir}`}
              >
                {sortDir === "asc" ? "⬆︎" : "⬇︎"}
              </button>

              <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                <option value={5}>5 / halaman</option>
                <option value={10}>10 / halaman</option>
                <option value={25}>25 / halaman</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="al-table al-loading">
            {[...Array(6)].map((_, i) => (
              <div className="al-row-skel" key={i}>
                <div className="skel skel-1" />
                <div className="skel skel-2" />
                <div className="skel skel-3" />
                <div className="skel skel-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="al-error">{error}</div>
        ) : (
          <>
            <div className="al-table">
              <div className="al-table-head">
                <div className="col name">Nama</div>
                <div className="col email">Email</div>
                <div className="col created">Dibuat</div>
                <div className="col updated">Diperbarui</div>
                <div className="col status">Status</div>
                <div className="col actions">Aksi</div>
              </div>

              <div className="al-table-body">
                {pageData.length === 0 ? (
                  <div className="al-empty">Tidak ada anggota sesuai pencarian.</div>
                ) : (
                  pageData.map((a) => (
                    <div className="al-row" key={a.id}>
                      <div className="col name">{a.nama}</div>
                      <div className="col email">{a.email}</div>
                      <div className="col created">{fmt(a.created_at)}</div>
                      <div className="col updated">{fmt(a.updated_at)}</div>
                      <div className="col status">
                        {a.deleted_at ? <span className="badge badge-deleted">Dihapus</span> : <span className="badge badge-active">Aktif</span>}
                      </div>
                      <div className="col actions">
                        <button className="btn small" onClick={() => navigate(`/anggota/${a.id}`)}>Lihat</button>
                        <button
                          className="btn small"
                          onClick={() => navigate(`/anggota/${a.id}/edit`)}
                          title="Edit anggota"
                          style={{ borderColor: "#e6eef8", background: "#fff" }}
                        >
                          Edit
                        </button>
                        <button className="btn small danger" onClick={() => handleDelete(a.id)}>Hapus</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="al-footer">
              <div className="al-meta">
                Menampilkan {Math.min((page - 1) * perPage + 1, total)} - {Math.min(page * perPage, total)} dari {total}
              </div>

              <div className="al-pager">
                <button onClick={() => setPage(1)} disabled={page === 1}>«</button>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                <span className="page-info">Hal {page} / {lastPage}</span>
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
