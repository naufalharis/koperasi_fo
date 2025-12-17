import React from "react";
import "./Tabungan.css";

interface Props {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

const fmtCurrency = (n?: number) =>
  typeof n === "number" ? n.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }) : "-";

const fmtDate = (s?: string) => {
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

const TabunganTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="tg-table-wrap">
      <table className="tg-table" aria-label="Tabel tabungan">
        <thead>
          <tr>
            <th>ID</th>
            <th>Anggota</th>
            <th>Kategori</th>
            <th>Tanggal</th>
            <th>Jumlah</th>
            <th style={{ width: 180 }}>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="tg-empty">Belum ada data tabungan.</td>
            </tr>
          ) : (
            data.map((t) => (
              <tr key={t.id}>
                <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.id}</td>
                <td>{t.anggota?.nama ?? "-"}</td>
                <td>{t.kategoriSimpanan?.nama ?? "-"}</td>
                <td>{fmtDate(t.tanggal)}</td>
                <td>{fmtCurrency(t.jumlah)}</td>
                <td>
                  <div className="tg-actions">
                    <button className="btn tg-row-btn" onClick={() => onEdit(t)}>Edit</button>
                    <button className="btn btn-danger tg-row-btn" onClick={() => onDelete(t.id)}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TabunganTable;
