export default function RecentTable({ data }) {
  return (
    <table width="100%" cellPadding="8">
      <thead>
        <tr style={{ background: "#f5f5f5" }}>
          <th align="left">Nama</th>
          <th align="left">Jenis</th>
          <th align="right">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.id}>
            <td>{r.name}</td>
            <td>{r.type}</td>
            <td align="right">{r.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
