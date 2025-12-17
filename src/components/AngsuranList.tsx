import { useEffect, useState, useMemo } from "react";
import { angsuranService } from "../services/angsuranService";
import { useNavigate } from "react-router-dom";
import "./AngsuranList.css";

export default function AngsuranList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // UI state - sama persis dengan AnggotaList
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "pinjaman_id" | "tanggal_pembayaran" | "jumlah_pembayaran" | "sisa_pinjaman">("tanggal_pembayaran");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await angsuranService.getAll();
      setData(res);
    } catch (err: any) {
      console.error("Error loading data:", err);
      setError(err?.response?.data?.message || "Gagal mengambil data angsuran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus angsuran ini?")) return;
    try {
      await angsuranService.delete(id);
      await loadData();
    } catch (err: any) {
      console.error("Error deleting angsuran:", err);
      alert(err?.response?.data?.message || "Gagal menghapus angsuran");
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date - sama dengan AnggotaList
  const fmt = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Client-side search + sort - sama logika dengan AnggotaList
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = data.slice();

    if (q) {
      list = list.filter(
        (a) =>
          a.id?.toString().toLowerCase().includes(q) ||
          a.pinjaman_id?.toString().toLowerCase().includes(q) ||
          formatCurrency(a.jumlah_pembayaran).toLowerCase().includes(q) ||
          formatCurrency(a.sisa_pinjaman).toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let A: string | number = (a as any)[sortBy] ?? "";
      let B: string | number = (b as any)[sortBy] ?? "";
      
      if (sortBy === "tanggal_pembayaran") {
        A = new Date(a.tanggal_pembayaran).getTime();
        B = new Date(b.tanggal_pembayaran).getTime();
      } else if (sortBy === "jumlah_pembayaran" || sortBy === "sisa_pinjaman") {
        A = Number(A);
        B = Number(B);
      } else {
        A = String(A).toLowerCase();
        B = String(B).toLowerCase();
      }
      
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [data, search, sortBy, sortDir]);

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  // Toggle sort - sama dengan AnggotaList
  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  return (
    <div className="al-root">
      <div className="al-card">
        {/* HEADER - SAMA PERSIS DENGAN ANGGOTALIST */}
        <div className="al-header">
          <h3>Data Angsuran</h3>

          <div className="al-controls">
            <div className="al-search">
              <input
                placeholder="Cari ID, pinjaman, atau jumlah..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                aria-label="Cari angsuran"
              />
            </div>

            <div className="al-selects">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="tanggal_pembayaran">Terbaru</option>
                <option value="id">ID</option>
                <option value="pinjaman_id">Pinjaman</option>
                <option value="jumlah_pembayaran">Jumlah Bayar</option>
                <option value="sisa_pinjaman">Sisa Pinjaman</option>
              </select>

              <button
                className="al-sort-btn"
                onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
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

        {/* ACTION BUTTONS - DI HEADER SEPERTI ANGGOTALIST */}
        <div style={{ 
          padding: "0.75rem 1.5rem", 
          background: "#f8fafc", 
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div className="al-controls">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate("/angsuran/tambah")}
            >
              + Tambah Angsuran
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="al-table al-loading">
            {[...Array(6)].map((_, i) => (
              <div className="al-row-skel" key={i}>
                <div className="skel skel-1" />
                <div className="skel skel-2" />
                <div className="skel skel-3" />
                <div className="skel skel-4" />
                <div className="skel skel-5" />
                <div className="skel skel-6" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="al-error">{error}</div>
        ) : (
          <>
            {/* TABLE - SAMA STRUKTUR DENGAN ANGGOTALIST */}
            <div className="al-table">
              <div className="al-table-head">
                <div className="col id">ID</div>
                <div className="col pinjaman">ID Pinjaman</div>
                <div className="col tanggal">Tanggal Bayar</div>
                <div className="col jumlah">Jumlah Bayar</div>
                <div className="col sisa">Sisa Pinjaman</div>
                <div className="col actions">Aksi</div>
              </div>

              <div className="al-table-body">
                {pageData.length === 0 ? (
                  <div className="al-empty">Tidak ada data angsuran sesuai pencarian.</div>
                ) : (
                  pageData.map((a) => (
                    <div className="al-row" key={a.id}>
                      <div className="col id">
                        <span style={{ 
                          fontFamily: 'monospace',
                          backgroundColor: '#f1f5f9',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.8125rem'
                        }}>
                          {a.id}
                        </span>
                      </div>
                      <div className="col pinjaman">
                        <span style={{ color: '#3b82f6', fontWeight: 500 }}>{a.pinjaman_id}</span>
                      </div>
                      <div className="col tanggal">{fmt(a.tanggal_pembayaran)}</div>
                      <div className="col jumlah">
                        <span style={{ color: '#16a34a', fontWeight: 600 }}>
                          {formatCurrency(a.jumlah_pembayaran)}
                        </span>
                      </div>
                      <div className="col sisa">
                        <span style={{ 
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: (a.sisa_pinjaman || 0) > 0 ? '#fef3c7' : '#dcfce7',
                          color: (a.sisa_pinjaman || 0) > 0 ? '#92400e' : '#166534'
                        }}>
                          {formatCurrency(a.sisa_pinjaman)}
                        </span>
                      </div>
                      <div className="col actions">
                        <button className="btn small" onClick={() => navigate(`/angsuran/edit/${a.id}`)}>Edit</button>
                        <button 
                          className="btn small danger" 
                          onClick={() => handleDelete(a.id)}
                          style={{ marginLeft: '0.5rem' }}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* FOOTER - SAMA PERSIS DENGAN ANGGOTALIST */}
            <div className="al-footer">
              <div className="al-meta">
                Menampilkan {Math.min((page - 1) * perPage + 1, total)} - {Math.min(page * perPage, total)} dari {total}
              </div>

              <div className="al-pager">
                <button onClick={() => setPage(1)} disabled={page === 1}>«</button>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                <span className="page-info">Hal {page} / {lastPage}</span>
                <button onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page === lastPage}>›</button>
                <button onClick={() => setPage(lastPage)} disabled={page === lastPage}>»</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}