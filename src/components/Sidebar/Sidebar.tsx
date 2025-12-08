import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Koperasi</h2>
      </div>

      <ul className="sidebar-menu">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/anggota">Anggota</Link></li>
        <li><Link to="/pinjaman">Pinjaman</Link></li>
        <li><Link to="/angsuran">Angsuran</Link></li>
        <li><Link to="/simpanan">Simpanan</Link></li>
        <li><Link to="/laporan">Laporan</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
