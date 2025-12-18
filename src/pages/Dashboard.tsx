import StatCard from "../components/dashboard/StatCard";
import "../styles/dashboard.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  /* =====================
     DATA STATISTIK
  ====================== */
  const stats = [
    { title: "TOTAL ANGGOTA", value: 124, bg: "#2f5d8a" },
    { title: "PINJAMAN AKTIF", value: 32, bg: "#8bc34a" },
    { title: "ANGSURAN BULAN INI", value: 58, bg: "#29b6f6" },
    { title: "SALDO KAS", value: "Rp 18.000.000", bg: "#ff8a3d" },
  ];

  /* =====================
     DATA TABLE
  ====================== */
  const pembayaran = [
    {
      id: 1,
      nama: "Budi Santoso",
      jumlah: 500000,
      status: "Lunas",
    },
    {
      id: 2,
      nama: "Siti Aminah",
      jumlah: 750000,
      status: "Lunas",
    },
    {
      id: 3,
      nama: "Andi Wijaya",
      jumlah: 1000000,
      status: "Proses",
    },
    {
      id: 4,
      nama: "Rina Lestari",
      jumlah: 650000,
      status: "Proses",
    },
  ];

  /* =====================
     DATA CHART
  ====================== */
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    datasets: [
      {
        label: "Total Angsuran (Rp)",
        data: [8500000, 9200000, 7800000, 11000000, 9800000, 12500000],
        backgroundColor: "#29b6f6",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) =>
            "Rp " + value.toLocaleString("id-ID"),
        },
      },
    },
  };

  return (
    <div className="dashboard-wrapper">
      <h2>Dashboard</h2>

      {/* =====================
         TOP CARDS
      ====================== */}
      <div className="admin-cards">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            bg={item.bg}
          />
        ))}
      </div>

      {/* =====================
         MAIN CONTENT
      ====================== */}
      <div className="admin-content">
        {/* LEFT */}
        <div className="admin-panel">
          <h4>Laporan Angsuran Bulanan</h4>
          <div className="chart-box">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="admin-panel">
          <div className="alert-success">
            ✅ 5 angsuran berhasil dibayar hari ini
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama Anggota</th>
                <th>Jumlah</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pembayaran.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nama}</td>
                  <td>
                    Rp {item.jumlah.toLocaleString("id-ID")}
                  </td>
                  <td
                    className={
                      item.status === "Lunas"
                        ? "status-lunas"
                        : "status-proses"
                    }
                  >
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
