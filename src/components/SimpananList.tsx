import React, { useEffect, useMemo, useState } from "react";
import type { Simpanan } from "../services/simpananService";
import { simpananService } from "../services/simpananService";
import SimpananForm from "./SimpananForm";
import "./Simpanan.css";

export default function SimpananList() {
  const [items, setItems] = useState<Simpanan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI
  const [editing, setEditing] = useState<Simpanan | null>(null);
  const [showDeleted, setShowDeleted] = useState(false); // false = active, true = trash
  const [search, setSearch] = useState("");

  // fetch (support includeDeleted flag if service supports it)
  const fetchData = async (includeDeleted = false) => {
    setLoading(true);
    setError(null);
    try {
      // simpananService.getAll may accept includeDeleted flag; if not, adjust service
      const res = await simpananService.getAll(includeDeleted);
      // accept array or { data: [...] }
      const arr = Array.isArray(res) ? res : (res?.data ?? []);
      setItems(arr);
    } catch (err: any) {
      console.error("Gagal ambil kategori simpanan:", err);
      setError(err?.message || "Gagal mengambil data");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(showDeleted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDeleted]);

  const active = items.filter((i) => !i.deleted_at);
  const deleted = items.filter((i) => !!i.deleted_at);

  const list = showDeleted ? deleted : active;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((s) => s.nama.toLowerCase().includes(q));
  }, [list, search]);

  // actions
  const handleSoftDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini (soft-delete)?")) return;
    try {
      await simpananService.softDelete(id, "system"); // ganti 'system' ke userId jika ada
      await fetchData(showDeleted);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus kategori");
    }
  };

  const handleRestore = async (id: string) => {
    if (!confirm("Restore kategori ini?")) return;
    try {
      await simpananService.restore(id, "system");
      await fetchData(showDeleted);
    } catch (err) {
      console.error(err);
      alert("Gagal merestore kategori");
    }
  };

  const handleForceDelete = async (id: string) => {
    if (!confirm("Hapus permanen kategori ini? Tindakan tidak dapat dikembalikan.")) return;
    try {
      await simpananService.forceDelete(id);
      await fetchData(showDeleted);
    } catch (err) {
      console.error(err);
      alert("Gagal hapus permanen");
    }
  };

  return (
    <div className="sm-root">
      <div className="sm-card">
        <div className="sm-header">
          <div>
            <h2 className="sm-title">Kategori Simpanan</h2>
            <div className="sm-sub">Kelola kategori simpanan anggota</div>
          </div>

          <div className="sm-controls">
            <div className="sm-tabs" role="tablist">
              <button
                className={`sm-tab ${!showDeleted ? "active" : ""}`}
                onClick={() => setShowDeleted(false)}
              >
                Semua <span className="sm-count">{active.length}</span>
              </button>
              <button
                className={`sm-tab ${showDeleted ? "active" : ""}`}
                onClick={() => setShowDeleted(true)}
              >
                Tong Sampah <span className="sm-count">{deleted.length}</span>
              </button>
            </div>

            <input
              className="sm-search"
              placeholder="Cari kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {!showDeleted && (
              <button className="btn btn-primary" onClick={() => setEditing({} as Simpanan)}>
                + Tambah
              </button>
            )}
          </div>
        </div>

        <div className="sm-body">
          {/* form */}
          {editing !== null && (
            <SimpananForm
              editing={editing}
              onSuccess={async () => {
                setEditing(null);
                await fetchData(showDeleted);
              }}
              setEditing={setEditing}
            />
          )}

          {/* table / content */}
          {loading ? (
            <div className="sm-empty">Memuat...</div>
          ) : error ? (
            <div className="sm-error">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="sm-empty">Tidak ada data.</div>
          ) : (
            <div className="sm-table-wrap">
              <table className="sm-table" aria-label="Daftar kategori simpanan">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th style={{ width: 220 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className={s.deleted_at ? "muted" : ""}>
                      <td>{s.nama}</td>
                      <td>
                        <div className="sm-actions">
                          {!showDeleted ? (
                            <>
                              <button className="btn" onClick={() => setEditing(s)}>Edit</button>
                              <button className="btn btn-danger" onClick={() => handleSoftDelete(s.id)}>Hapus</button>
                            </>
                          ) : (
                            <>
                              <button className="btn" onClick={() => handleRestore(s.id)}>Restore</button>
                              <button className="btn btn-danger" onClick={() => handleForceDelete(s.id)}>Hapus Permanen</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="sm-footer">
          <div className="sm-sub">Menampilkan {filtered.length} item</div>
        </div>
      </div>
    </div>
  );
}
