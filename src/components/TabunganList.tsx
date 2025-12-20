// src/components/TabunganList.tsx
import React, { useEffect, useState } from "react";
import { tabunganService } from "../services/tabunganService";
import TabunganForm from "./TabunganForm";
import TabunganTable from "./TabunganTable";
import PenarikanForm from "./PenarikanForm"; // <-- buat form penarikan (lihat kode yang sudah saya kirim)
import "./Tabungan.css";

const TabunganList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | false>(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [withdrawTarget, setWithdrawTarget] = useState<any | null>(null); // <-- target penarikan
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tabunganService.getAll();
      // accept both array or { data: [...] }
      const arr = Array.isArray(res) ? res : (res?.data ?? []);
      setData(arr);
    } catch (err: any) {
      console.error("Gagal load tabungan:", err);
      setData([]);
      setError(err?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus?")) return;
    try {
      await tabunganService.delete(id);
      await load();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    }
  };

  // handler untuk sukses penarikan: refresh dan tutup form
  const handleWithdrawSuccess = async () => {
    setWithdrawTarget(null);
    await load();
  };

  const filtered = data.filter((t) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (t.anggota?.nama ?? "").toLowerCase().includes(q) ||
      (t.kategoriSimpanan?.nama ?? "").toLowerCase().includes(q) ||
      String(t.jumlah).toLowerCase().includes(q)
    );
  });

  return (
    <div className="tg-root">
      <div className="tg-card">
        <div className="tg-header">
          <div>
            <h2 className="tg-title">Data Tabungan</h2>
            <div className="tg-sub">Kelola setoran anggota — tambah, ubah, tarik, dan hapus</div>
          </div>

          <div className="tg-controls">
            <input
              className="tg-search"
              placeholder="Cari anggota / kategori / nominal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn" onClick={() => setEditing({})}>+ Tambah Tabungan</button>
          </div>
        </div>

        <div className="tg-body">
          {editing !== false && (
            <TabunganForm
              editing={editing}
              onSuccess={async () => { setEditing(false); await load(); }}
              onCancel={() => setEditing(false)}
            />
          )}

          {/* PenarikanForm muncul ketika ada withdrawTarget */}
          {withdrawTarget && (
            <div style={{ marginTop: 12 }}>
              <PenarikanForm
                tabungan={withdrawTarget}
                onCancel={() => setWithdrawTarget(null)}
                onSuccess={handleWithdrawSuccess}
              />
            </div>
          )}

          {loading ? (
            <div className="tg-empty">Memuat...</div>
          ) : error ? (
            <div className="tg-empty" style={{ color: "crimson" }}>{error}</div>
          ) : (
            <>
              {/* Kirim onWithdraw agar TabunganTable menampilkan tombol Tarik */}
              <TabunganTable
                data={filtered}
                onEdit={(i) => setEditing(i)}
                onDelete={handleDelete}
                onWithdraw={(item) => {
                  // optional: guard sebelum tampilkan form
                  if (!item || (item.jumlah ?? 0) <= 0) {
                    alert("Saldo kosong, tidak bisa ditarik.");
                    return;
                  }
                  setWithdrawTarget(item);
                }}
              />

              <div className="tg-footer">
                <div className="tg-sub">Menampilkan {filtered.length} item</div>
                <div className="tg-sub">Terakhir diperbarui: {/* optional: show timestamp */}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabunganList;
