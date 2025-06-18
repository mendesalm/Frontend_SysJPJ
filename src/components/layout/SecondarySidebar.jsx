// src/components/layout/SecondarySidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const menuData = {
  "menu-usuario": {
    title: "Painel do Usuário",
    items: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Meus Dados Pessoais", path: "/perfil" },
      { label: "Mural de Avisos", path: "/mural-de-avisos" },
      { label: "Publicações", path: "/publicacoes" },
      { label: "Minhas Visitações", path: "/minhas-visitacoes" },
    ],
  },
  "menu-secretaria": {
    title: "Secretaria",
    items: [
      { label: "Gestão de Membros", path: "/admin/members" },
      { label: "Gestão de Sessões e Balaústres", path: "/sessoes" },
      { label: "Gestão de Publicações", path: "/publicacoes" },
    ],
  },
  "menu-chancelaria": {
    title: "Chancelaria",
    items: [
      { label: "Dados de Membros", path: "/admin/members" },
      { label: "Gestão de Sessões", path: "/sessoes" },
      { label: "Controle de Frequência", path: "/relatorios" },
      { label: "Controle de Visitações", path: "/admin/visitacoes" },
      { label: "Gestão de Eventos", path: "/eventos" },
      { label: "Gestão da Escala de Jantares", path: "/admin/escala-jantares" },
    ],
  },
  "menu-tesouraria": {
    title: "Tesouraria",
    items: [
      { label: "Plano de Contas", path: "/financeiro/plano-contas" },
      { label: "Lançamentos", path: "/financeiro/lancamentos" },
      { label: "Orçamento", path: "/financeiro/orcamento" },
    ],
  },
  "menu-biblioteca": {
    title: "Biblioteca",
    items: [{ label: "Acervo", path: "/biblioteca" }],
  },
  "menu-harmonia": {
    title: "Harmonia",
    items: [
      { label: "Player de Harmonia", path: "/player-harmonia" },
      { label: "Montagem de Sequências", path: "/admin/harmonia/sequencias" },
      { label: "Gestão de Playlists", path: "/admin/harmonia/playlists" },
      { label: "Gestão de Músicas", path: "/admin/harmonia/musicas" },
    ],
  },
  "menu-webmaster": {
    title: "Webmaster",
    items: [
      { label: "Gestão de Permissões", path: "/admin/permissions" },
      { label: "Gestão de Templates", path: "/admin/templates" },
      { label: "Configurações Gerais", path: "#" },
    ],
    adminOnly: true,
  },
};

const SecondarySidebar = ({ activeMenu }) => {
  const { user } = useAuth();
  const finalClassName = `secondary-sidebar ${activeMenu ? "is-open" : ""}`;

  const isWebmaster = user?.credencialAcesso === "Webmaster";

  const shouldRenderMenu = (menu) => {
    if (!menu) return false;
    if (menu.adminOnly && !isWebmaster) return false;
    return true;
  };

  return (
    <div className={finalClassName}>
      {Object.entries(menuData).map(([key, menu]) => {
        if (!shouldRenderMenu(menu)) return null;
        const contentClassName = `menu-content ${
          activeMenu === key ? "is-visible" : ""
        }`;
        return (
          <div key={key} id={key} className={contentClassName}>
            <h3>{menu.title}</h3>
            <ul className="secondary-menu">
              {menu.items.map((item) => (
                // CORREÇÃO: A chave agora é uma combinação única do grupo e do caminho do item.
                <li key={`${key}-${item.path}`}>
                  <NavLink to={item.path}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default SecondarySidebar;
