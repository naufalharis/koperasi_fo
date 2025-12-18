import React, { useState } from "react";
import "./Sidebar.css";
import { Link, useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [openKategori, setOpenKategori] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // hapus auth
    localStorage.removeItem("access_token");
    localStorage.removeItem("jabatan"); // jika kamu simpan
    localStorage.removeItem("user");    // jika ada

    // redirect ke login
    navigate("/login", { replace: true });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Koperasi</h2>
      </div>

      <ul className="sidebar-menu">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/pinjaman">Pinjaman</Link></li>
        <li><Link to="/angsuran">Angsuran</Link></li>
        <li><Link to="/tabungan">Tabungan</Link></li>

        {/* KATEGORI */}
        <li
          className="menu-parent"
          onClick={() => setOpenKategori(!openKategori)}
        >
          <span className="menu-title">
            Kategori {openKategori ? "▾" : "▸"}
          </span>
        </li>

        {openKategori && (
          <ul className="submenu">
            <li><Link to="/simpanan">Simpanan</Link></li>
            <li><Link to="/jangkaWaktu">Jangka Waktu</Link></li>
          </ul>
        )}

        <li><Link to="/anggota">Anggota</Link></li>
        <li><Link to="/kas">Kas</Link></li>
        <li><Link to="/jabatan">Jabatan</Link></li>

        {/* LOGOUT */}
        <li className="logout" onClick={handleLogout}>
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
