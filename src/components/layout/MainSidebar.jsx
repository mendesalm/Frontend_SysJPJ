import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import ThemeSwitcher from "../ThemeSwitcher";
import logoJPJ from "../../assets/images/logo.png";
import MacomL from "../../assets/images/icones/light/Macom-L.png";
import SecretarioL from "../../assets/images/icones/light/Secretario-L.png";
import ChancelerL from "../../assets/images/icones/light/Chanceler-L.png";
import TesoureiroL from "../../assets/images/icones/light/Tesoureiro-L.png";
import BibliotecaL from "../../assets/images/icones/light/Biblioteca-L.png";
import HarmoniaL from "../../assets/images/icones/light/Harmonia-L.png";
import MacomD from "../../assets/images/icones/dark/Macom-D.png";
import SecretarioD from "../../assets/images/icones/dark/Secretario-D.png";
import ChancelerD from "../../assets/images/icones/dark/Chanceler-D.png";
import TesoureiroD from "../../assets/images/icones/dark/Tesoureiro-D.png";
import BibliotecaD from "../../assets/images/icones/dark/Biblioteca-D.png";
import HarmoniaD from "../../assets/images/icones/dark/Harmonia-D.png";

const IconWebmaster = () => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);
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

const lightIcons = {
  macom: MacomL,
  secretario: SecretarioL,
  chanceler: ChancelerL,
  tesoureiro: TesoureiroL,
  biblioteca: BibliotecaL,
  harmonia: HarmoniaL,
};
const darkIcons = {
  macom: MacomD,
  secretario: SecretarioD,
  chanceler: ChancelerD,
  tesoureiro: TesoureiroD,
  biblioteca: BibliotecaD,
  harmonia: HarmoniaD,
};

const MainSidebar = ({ activeMenu, onMenuClick }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const icons = theme === "light" ? lightIcons : darkIcons;
  const iconStyle = { height: "35px", width: "35px", objectFit: "contain" };

  const menuItems = [
    { id: "menu-usuario", tooltip: "Painel do Usuário", iconName: "macom" },
    { id: "menu-secretaria", tooltip: "Secretaria", iconName: "secretario" },
    { id: "menu-chancelaria", tooltip: "Chancelaria", iconName: "chanceler" },
    { id: "menu-tesouraria", tooltip: "Tesouraria", iconName: "tesoureiro" },
    { id: "menu-biblioteca", tooltip: "Biblioteca", iconName: "biblioteca" },
    { id: "menu-harmonia", tooltip: "Harmonia", iconName: "harmonia" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="main-sidebar">
      <Link to="/dashboard" className="main-sidebar-logo">
        <img src={logoJPJ} alt="Logo JPJ" className="logo-image" />
      </Link>
      <ul className="main-menu">
        {menuItems.map((item) => {
          const iconSrc = icons[item.iconName];
          return (
            <li key={item.id} className="main-menu-item">
              <button
                className={`main-menu-button ${
                  activeMenu === item.id ? "active" : ""
                }`}
                onClick={() => onMenuClick(item.id)} // Garantindo que o onClick está aqui
              >
                {iconSrc && (
                  <img
                    src={iconSrc}
                    alt={item.tooltip}
                    className="sidebar-icon"
                    style={iconStyle}
                  />
                )}
                <span className="tooltip">{item.tooltip}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="main-sidebar-footer">
        <button
          className={`main-menu-button ${
            activeMenu === "menu-webmaster" ? "active" : ""
          }`}
          onClick={() => onMenuClick("menu-webmaster")}
        >
          <IconWebmaster />
          <span className="tooltip">Webmaster</span>
        </button>
        <ThemeSwitcher />
        <button className="logout-button" onClick={handleLogout}>
          <IconLogout />
          <span className="tooltip">Sair</span>
        </button>
      </div>
    </nav>
  );
};

export default MainSidebar;
