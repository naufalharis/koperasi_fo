import React from "react";

interface Props {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

const AngsuranTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  return (
    <table border={1} cellPadding={5}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Pinjaman</th>
          <th>Tanggal</th>
          <th>Jumlah</th>
          <th>Sisa Pinjaman</th>
          <th>Aksi</th>
        </tr>
      </thead>

      <tbody>
        {data.map((a) => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.pinjaman_id}</td>
            <td>{a.tanggal_pembayaran.substring(0, 10)}</td>
            <td>Rp {a.jumlah_pembayaran.toLocaleString()}</td>
            <td>Rp {a.sisa_pinjaman.toLocaleString()}</td>
            <td>
              <button onClick={() => onEdit(a)}>Edit</button>
              <button onClick={() => onDelete(a.id)}>Hapus</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AngsuranTable;
