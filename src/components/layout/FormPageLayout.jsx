import React from "react";
import "./FormPageLayout.css"; // Vamos criar este ficheiro de estilos

/**
 * Componente de layout para páginas de formulário complexas.
 * Cria uma estrutura de duas colunas:
 * - Esquerda (principal): Conteúdo com scroll (o formulário).
 * - Direita (secundária): Painel de ações fixo.
 * @param {{ title: string, children: React.ReactNode, actionsComponent: React.ReactNode }} props
 */
const FormPageLayout = ({ title, children, actionsComponent }) => {
  return (
    <div className="form-page-layout">
      {/* Coluna principal com o formulário e scroll */}
      <div className="form-scroll-container">
        <div
          className="table-header"
          style={{
            marginBottom: "2rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid #374151",
          }}
        >
          <h1>{title}</h1>
        </div>
        {children}
      </div>

      {/* Coluna secundária com os botões de ação fixos */}
      <aside className="form-actions-sidebar">{actionsComponent}</aside>
    </div>
  );
};

export default FormPageLayout;
