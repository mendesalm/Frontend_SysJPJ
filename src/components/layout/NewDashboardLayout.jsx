import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MainSidebar from "./MainSidebar";
import SecondarySidebar from "./SecondarySidebar";
import "./NewDashboard.css";

const NewDashboardLayout = () => {
  const [activeMenu, setActiveMenu] = useState("menu-usuario");
  const location = useLocation();

  console.log("[NewDashboardLayout] A renderizar. Menu ativo:", activeMenu);

  useEffect(() => {
    const secondarySidebar = document.querySelector(".secondary-sidebar");
    if (secondarySidebar && secondarySidebar.classList.contains("is-open")) {
      // Lógica de fecho de menu, se necessário
    }
  }, [location]);

  const handleMenuClick = (menuId) => {
    setActiveMenu((prevMenu) => (prevMenu === menuId ? null : menuId));
  };

  return (
    <div className="new-dashboard-layout">
      <MainSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
      <SecondarySidebar activeMenu={activeMenu} />
      <main className="new-dashboard-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default NewDashboardLayout;
