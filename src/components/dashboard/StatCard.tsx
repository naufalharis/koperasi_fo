type Props = {
  title: string;
  value: string | number;
  bg: string;
};

export default function StatCard({ title, value, bg }: Props) {
  return (
    <div
      className="admin-card"
      style={{ backgroundColor: bg }}
    >
      <div className="admin-card-value">{value}</div>
      <div className="admin-card-title">{title}</div>
      <div className="admin-card-footer">SEE ALL →</div>
    </div>
  );
}
