// src/hooks/useTheme.js (NOVO ARQUIVO)

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Importa o contexto que acabamos de exportar

// Este arquivo agora tem a única responsabilidade de criar e exportar o hook.
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }

  return context;
};
