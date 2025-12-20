// src/components/TabunganTable.tsx
import React from "react";
import "./Tabungan.css";

interface AnggotaMin {
  id?: string;
  nama?: string;
}

interface KategoriMin {
  id?: string;
  nama?: string;
}

export interface TabunganItem {
  id: string;
  id_anggota?: string;
  id_kategori_simpanan?: string;
  tanggal?: string | null;
  jumlah?: number;
  note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  anggota?: AnggotaMin | null;
  kategoriSimpanan?: KategoriMin | null;
}

interface Props {
  data: TabunganItem[];
  onEdit: (item: TabunganItem) => void;
  onDelete: (id: string) => void;
  onWithdraw?: (item: TabunganItem) => void; // optional: tarik
  className?: string;
}

const fmtCurrency = (n?: number) =>
  typeof n === "number"
    ? n.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      })
    : "-";

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

export default function TabunganTable({ data, onEdit, onDelete, onWithdraw, className = "" }: Props) {
  return (
    <div className={`tg-table-wrap ${className}`}>
      <table className="tg-table" aria-label="Tabel tabungan">
        <thead>
          <tr>
            <th style={{ minWidth: 120 }}>ID</th>
            <th>Anggota</th>
            <th>Kategori</th>
            <th style={{ minWidth: 120 }}>Tanggal</th>
            <th style={{ textAlign: "right", minWidth: 140 }}>Jumlah</th>
            <th style={{ width: 220 }}>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="tg-empty">
                Belum ada data tabungan.
              </td>
            </tr>
          ) : (
            data.map((t) => {
              const muted = Boolean(t.deleted_at);
              return (
                <tr key={t.id} className={muted ? "muted" : ""}>
                  <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.id}
                  </td>

                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600 }}>{t.anggota?.nama ?? "-"}</span>
                      {t.note ? <small style={{ color: "#64748b" }}>{t.note}</small> : null}
                    </div>
                  </td>

                  <td>{t.kategoriSimpanan?.nama ?? "-"}</td>

                  <td>{fmtDate(t.tanggal)}</td>

                  <td style={{ textAlign: "right", fontWeight: 700 }}>{fmtCurrency(t.jumlah)}</td>

                  <td>
                    <div className="tg-actions" role="group" aria-label={`Aksi untuk tabungan ${t.id}`}>
                      <button
                        className="btn tg-row-btn"
                        onClick={() => onEdit(t)}
                        title="Edit tabungan"
                        aria-label={`Edit ${t.id}`}
                      >
                        Edit
                      </button>

                      {onWithdraw ? (
                        <button
                          className="btn tg-row-btn"
                          onClick={() => onWithdraw(t)}
                          title="Tarik dari tabungan"
                          aria-label={`Tarik ${t.id}`}
                          disabled={muted || (t.jumlah ?? 0) <= 0}
                        >
                          Tarik
                        </button>
                      ) : null}

                      <button
                        className="btn btn-danger tg-row-btn"
                        onClick={() => onDelete(t.id)}
                        title="Hapus tabungan"
                        aria-label={`Hapus ${t.id}`}
                        disabled={muted}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
