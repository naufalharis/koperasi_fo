import { useEffect, useMemo, useState } from "react";
import { pinjamanService } from "../services/pinjamanService";
import PinjamanForm from "./PinjamanForm";
import "./PinjamanList.css";

export default function PinjamanList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  
  // UI state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"anggota" | "jumlah" | "tanggal">("tanggal");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const res = showTrash
        ? await pinjamanService.trash()
        : await pinjamanService.list();
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [showTrash]);

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Filter and sort data
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = data.slice();

    if (q) {
      list = list.filter(item =>
        item.anggota?.nama?.toLowerCase().includes(q) ||
        item.anggota?.email?.toLowerCase().includes(q) ||
        formatCurrency(item.jumlah).toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let A: any, B: any;
      
      if (sortBy === "anggota") {
        A = a.anggota?.nama || "";
        B = b.anggota?.nama || "";
      } else if (sortBy === "jumlah") {
        A = a.jumlah || 0;
        B = b.jumlah || 0;
      } else {
        A = new Date(a.tanggal || 0).getTime();
        B = new Date(b.tanggal || 0).getTime();
      }
      
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [data, search, sortBy, sortDir]);

  // Pagination
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="pl-root">
      <div className="pl-card">
        {/* Header dengan search dan filter */}
        <div className="pl-header">
          <h3>{showTrash ? "Data Pinjaman Terhapus" : "Daftar Pinjaman"}</h3>

          <div className="pl-controls">
            <div className="pl-search">
              <input
                placeholder="Cari nama anggota, email, atau jumlah..."
                value={search}
                onChange={(e) => { 
                  setSearch(e.target.value); 
                  setPage(1); 
                }}
                aria-label="Cari pinjaman"
              />
            </div>

            <div className="pl-selects">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="tanggal">Tanggal Terbaru</option>
                <option value="anggota">Nama Anggota</option>
                <option value="jumlah">Jumlah Pinjaman</option>
              </select>

              <button
                className="pl-sort-btn"
                onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
                aria-label="Toggle sort direction"
                title={`Urut: ${sortDir}`}
              >
                {sortDir === "asc" ? "↑" : "↓"}
              </button>

              <select 
                value={perPage} 
                onChange={(e) => { 
                  setPerPage(Number(e.target.value)); 
                  setPage(1); 
                }}
              >
                <option value={5}>5 per halaman</option>
                <option value={10}>10 per halaman</option>
                <option value={25}>25 per halaman</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pl-actions">
          <div className="pl-action-buttons">
            {!showTrash && (
              <button 
                className="btn btn-primary" 
                onClick={() => setOpenForm(true)}
              >
                + Tambah
              </button>
            )}

            <button
              className={showTrash ? "btn btn-secondary" : "btn btn-danger"}
              onClick={() => {
                setShowTrash(!showTrash);
                setPage(1);
              }}
            >
              {showTrash ? "← Kembali ke Daftar" : "🗑️ Data  sudah Terhapus"}
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="pl-loading">
            <div className="pl-row-skel">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`skel skel-${i + 1}`} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="pl-table">
              <div className="pl-table-head">
                <div className="col">Nama Anggota</div>
                <div className="col">Jumlah Pinjaman</div>
                <div className="col">Tanggal Pinjam</div>
                <div className="col">Jatuh Tempo</div>
                <div className="col">Status</div>
                <div className="col">Aksi</div>
              </div>

              <div className="pl-table-body">
                {pageData.length === 0 ? (
                  <div className="pl-empty">
                    {showTrash 
                      ? "Tidak ada data pinjaman yang dihapus" 
                      : "Tidak ada data pinjaman"}
                  </div>
                ) : (
                  pageData.map((item) => (
                    <div key={item.id} className="pl-row">
                      <div className="col">
                        <div style={{ fontWeight: 500 }}>{item.anggota?.nama || '-'}</div>
                        {item.anggota?.email && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                            {item.anggota.email}
                          </div>
                        )}
                      </div>
                      <div className="col">{formatCurrency(item.jumlah || 0)}</div>
                      <div className="col">{formatDate(item.tanggal)}</div>
                      <div className="col">{formatDate(item.tanggal_jatuh_tempo)}</div>
                      <div className="col">
                        {!item.deleted_at ? (
                          item.status === "LUNAS" ? (
                            <span className="badge badge-lunas">LUNAS</span>
                          ) : (
                            <span className="badge badge-belum">BELUM LUNAS</span>
                          )
                        ) : (
                          <span className="badge badge-soft-delete">TERHAPUS</span>
                        )}
                      </div>
                      <div className="col">
                        <div className="pl-row-actions">
                          {!showTrash ? (
                            <>
                              <button 
                                className="btn btn-small btn-secondary"
                                onClick={() => {
                                  // TODO: Implement edit
                                  console.log('Edit:', item.id);
                                }}
                                title="Edit pinjaman"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-small btn-danger"
                                onClick={async () => {
                                  if (window.confirm('Hapus data pinjaman ini?')) {
                                    await pinjamanService.softDelete(item.id);
                                    loadData();
                                  }
                                }}
                              >
                                Hapus
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-small btn-secondary"
                                onClick={async () => {
                                  if (window.confirm('Pulihkan data ini?')) {
                                    await pinjamanService.restore(item.id);
                                    loadData();
                                  }
                                }}
                              >
                                Pulihkan
                              </button>
                              <button
                                className="btn btn-small btn-danger"
                                onClick={async () => {
                                  if (window.confirm('Hapus permanen? Data tidak dapat dikembalikan!')) {
                                    await pinjamanService.hardDelete(item.id);
                                    loadData();
                                  }
                                }}
                              >
                                Hapus Permanen
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pagination */}
            {total > 0 && (
              <div className="pl-footer">
                <div className="pl-meta">
                  Menampilkan {Math.min((page - 1) * perPage + 1, total)} - {Math.min(page * perPage, total)} dari {total} data
                </div>
                <div className="pl-pager">
                  <button onClick={() => setPage(1)} disabled={page === 1}>
                    «
                  </button>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    ‹
                  </button>
                  <span className="page-info">
                    Halaman {page} dari {lastPage}
                  </span>
                  <button onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page === lastPage}>
                    ›
                  </button>
                  <button onClick={() => setPage(lastPage)} disabled={page === lastPage}>
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      {openForm && (
        <PinjamanForm 
          onClose={() => {
            setOpenForm(false);
            loadData();
          }} 
        />
      )}
    </div>
  );
}