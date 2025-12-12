import React from "react";

interface Props {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

const TabunganTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  return (
    <table border={1} cellPadding={8} style={{ width: "100%", marginTop: 20 }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Anggota</th>
          <th>Kategori</th>
          <th>Tanggal</th>
          <th>Jumlah</th>
          <th>Aksi</th>
        </tr>
      </thead>

      <tbody>
        {data.map((t) => (
          <tr key={t.id}>
            <td>{t.id}</td>
            <td>{t.anggota?.nama}</td>
            <td>{t.kategoriSimpanan?.nama}</td>
            <td>{t.tanggal.substring(0, 10)}</td>
            <td>Rp {t.jumlah.toLocaleString()}</td>
            <td>
              <button onClick={() => onEdit(t)}>Edit</button>
              <button onClick={() => onDelete(t.id)}>Hapus</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TabunganTable;
