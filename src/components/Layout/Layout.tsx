import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Halaman tanpa sidebar
  const hideSidebarRoutes = ["/", "/login", "/register"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  const sidebarWidth = 120; // px

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      {!hideSidebar && (
        <div style={{ width: sidebarWidth }}>
          <Sidebar />
        </div>
      )}

      {/* Konten utama */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          marginLeft: hideSidebar ? 0 : sidebarWidth, // ← FIX DI SINI
          transition: "margin-left 0.2s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
