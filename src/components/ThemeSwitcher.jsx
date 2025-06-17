import React from "react";
import { useTheme } from "../hooks/useTheme";
import { FaSun, FaMoon } from "react-icons/fa"; // Esta linha agora funcionará
import "./ThemeSwitcher.css";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-switcher" onClick={toggleTheme}>
      {theme === "light" ? (
        <FaMoon className="icon" title="Ativar Modo Escuro" />
      ) : (
        <FaSun className="icon" title="Ativar Modo Claro" />
      )}
    </div>
  );
};

export default ThemeSwitcher;
