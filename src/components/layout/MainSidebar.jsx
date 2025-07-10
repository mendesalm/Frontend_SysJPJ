import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import logoJPJ from "../../assets/images/logo.png";
import MacomL from "../../assets/images/icones/light/Macom-L.png";
import SecretarioL from "../../assets/images/icones/light/Secretario-L.png";
import ChancelerL from "../../assets/images/icones/light/Chanceler-L.png";
import TesoureiroL from "../../assets/images/icones/light/Tesoureiro-L.png";
import BibliotecaL from "../../assets/images/icones/light/Biblioteca-L.png";
import HarmoniaL from "../../assets/images/icones/light/Harmonia-L.png";
import OratoriaL from "../../assets/images/icones/light/Oratoria-L.png";
import ArquitetoL from "../../assets/images/icones/light/Arquiteto-L.png";
import MacomD from "../../assets/images/icones/dark/Macom-D.png";
import SecretarioD from "../../assets/images/icones/dark/Secretario-D.png";
import ChancelerD from "../../assets/images/icones/dark/Chanceler-D.png";
import TesoureiroD from "../../assets/images/icones/dark/Tesoureiro-D.png";
import BibliotecaD from "../../assets/images/icones/dark/Biblioteca-D.png";
import HarmoniaD from "../../assets/images/icones/dark/Harmonia-D.png";
import OratoriaD from "../../assets/images/icones/dark/Oratoria-D.png";
import ArquitetoD from "../../assets/images/icones/dark/Arquiteto-D.png";

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

const lightIcons = {
  macom: MacomL,
  secretario: SecretarioL,
  chanceler: ChancelerL,
  tesoureiro: TesoureiroL,
  biblioteca: BibliotecaL,
  harmonia: HarmoniaL,
  oratoria: OratoriaL,
  arquiteto: ArquitetoL,
};
const darkIcons = {
  macom: MacomD,
  secretario: SecretarioD,
  chanceler: ChancelerD,
  tesoureiro: TesoureiroD,
  biblioteca: BibliotecaD,
  harmonia: HarmoniaD,
  oratoria: OratoriaD,
  arquiteto: ArquitetoD,
};

const MainSidebar = ({ activeMenu, onMenuClick }) => {
  const { theme } = useTheme();

  const icons = theme === "light" ? lightIcons : darkIcons;
  const iconStyle = { height: "35px", width: "35px", objectFit: "contain" };

  const menuItems = [
    { id: "menu-usuario", tooltip: "Painel do Usuário", iconName: "macom" },
    { id: "menu-secretaria", tooltip: "Secretaria", iconName: "secretario" },
    { id: "menu-chancelaria", tooltip: "Chancelaria", iconName: "chanceler" },
    { id: "menu-tesouraria", tooltip: "Tesouraria", iconName: "tesoureiro" },
    { id: "menu-oratoria", tooltip: "Oratória", iconName: "oratoria" },
    { id: "menu-arquiteto", tooltip: "Arquiteto", iconName: "arquiteto" },
    { id: "menu-biblioteca", tooltip: "Biblioteca", iconName: "biblioteca" },
    { id: "menu-harmonia", tooltip: "Harmonia", iconName: "harmonia" },
  ];

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
                onClick={() => onMenuClick(item.id)}
              >
                {iconSrc ? (
                  <img
                    src={iconSrc}
                    alt={item.tooltip}
                    className="sidebar-icon"
                    style={iconStyle}
                  />
                ) : (
                  item.iconComponent
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
      </div>
    </nav>
  );
};

export default MainSidebar;

