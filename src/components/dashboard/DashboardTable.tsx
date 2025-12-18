export default function DashboardTable() {
  return (
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>Anggota</th>
          <th>Jenis</th>
          <th>Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Budi</td>
          <td>Angsuran</td>
          <td>Rp 1.500.000</td>
        </tr>
        <tr>
          <td>Siti</td>
          <td>Pinjaman</td>
          <td>Rp 5.000.000</td>
        </tr>
        <tr>
          <td>Andi</td>
          <td>Simpanan</td>
          <td>Rp 500.000</td>
        </tr>
      </tbody>
    </table>
  );
}
