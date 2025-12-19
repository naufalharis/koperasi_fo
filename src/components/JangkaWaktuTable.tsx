import type { KategoriJangkaWaktu } from "../types/JangkaWaktu";

interface Props {
  data: KategoriJangkaWaktu[];
  onEdit: (item: KategoriJangkaWaktu) => void;
  onSoftDelete: (id: string) => void;
  onHardDelete: (id: string) => void;
}

export default function KategoriJangkaWaktuTable({
  data,
  onEdit,
  onSoftDelete,
  onHardDelete,
}: Props) {
  return (
    <div className="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Nama</th>
        <th style={{ width: 220 }} >Aksi</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item.id}>
          <td>{item.nama}</td>
          <td>
            <div className="action-buttons">
              <button className="btn btn-warning" onClick={() => onEdit(item)}>
                Edit
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onSoftDelete(item.id)}
              >
                Soft
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onHardDelete(item.id)}
              >
                Hard
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
}
