import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MainSidebar from "./MainSidebar";
import SecondarySidebar from "./SecondarySidebar";
import "./NewDashboard.css";
import { useAuth } from "../../hooks/useAuth";
import ThemeSwitcher from "../ThemeSwitcher";

const IconLogout = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const NewDashboardLayout = () => {
  const [activeMenu, setActiveMenu] = useState("menu-usuario");
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="restricted-area-header">
        <span className="header-title-text">
          Loja Maçonica João Pedro Junqueira nº2181
        </span>
        <div className="header-actions">
          <ThemeSwitcher />
          <button className="logout-button" onClick={handleLogout}>
            <IconLogout />
            <span className="tooltip">Sair</span>
          </button>
        </div>
      </header>
      <div className="new-dashboard-layout">
        <MainSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
        <SecondarySidebar activeMenu={activeMenu} />
        <main className="new-dashboard-main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default NewDashboardLayout;
