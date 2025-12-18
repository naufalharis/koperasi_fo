import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const Layout = () => {
  const location = useLocation();

  const hideSidebarRoutes = ["/login", "/register"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div style={{ display: "flex", minHeight: "100vh", marginLeft: "260px" }}>
      {!hideSidebar && <Sidebar />}

      <div style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
