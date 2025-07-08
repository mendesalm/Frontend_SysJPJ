import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// menuConfig permanece o mesmo
const menuConfig = {
  "menu-usuario": {
    title: "Painel do Usuário",
    items: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Meus Dados Pessoais", path: "/perfil" },
      { label: "Mural de Avisos", path: "/mural-de-avisos" },
      { label: "Publicações", path: "/publicacoes" },
      { label: "Minhas Visitações", path: "/minhas-visitacoes" },
      { label: "Classificados", path: "/classificados" },
    ],
  },
  "menu-secretaria": {
    title: "Secretaria",
    items: [
      { label: "Gestão de Membros", path: "/admin/members" },
      { label: "Gestão de Sessões e Balaústres", path: "/sessoes" },
      { label: "Gestão de Publicações", path: "/publicacoes" },
      { label: "Documentos", path: "/documentos" },
      { label: "Arquivos Diversos", path: "/arquivos-diversos" },
    ],
  },
  "menu-chancelaria": {
    title: "Chancelaria",
    items: [
      { label: "Dados de Membros", path: "/admin/members" },
      { label: "Gestão de Sessões", path: "/sessoes" },
      {
        label: "Gestão de Comissões",
        path: "/comissoes",
        permission: "listarComissoes", // Usando a permissão de listar como guarda
      },
      {
        label: "Relatórios da Chancelaria",
        path: "/chanceler/relatorios",
        permission: "acessarRelatoriosChancelaria",
      },
      { label: "Controle de Visitações", path: "/admin/visitacoes" },
      { label: "Gestão da Escala de Jantares", path: "/admin/escala-jantares" },
      { label: "Geração de Cartões", path: "/chancelaria/gerar-cartoes" },
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
  "menu-oratoria": {
    title: "Oratória",
    items: [{ label: "Legislações", path: "/legislacoes" }],
  },
  "menu-arquiteto": {
    title: "Arquitetura",
    items: [
      { label: "Gestão de Patrimônio", path: "/patrimonio" },
      { label: "Locação do Salão", path: "/locacao-salao" },
    ],
  },
  "menu-biblioteca": {
    title: "Biblioteca",
    items: [
      { label: "Acervo", path: "/biblioteca" },
      { label: "Gerir Solicitações", path: "/admin/biblioteca/solicitacoes" },
    ],
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
      {
        label: "Configurar Balaústre",
        path: "/admin/balaustre-settings",
        permission: "gerenciarConfiguracoes",
      },
      { label: "Configurações Gerais", path: "/admin/general-settings" },
    ],
    adminOnly: true,
  },
};

const SecondarySidebar = ({ activeMenu }) => {
  const { user, hasPermission, loading } = useAuth();
  const finalClassName = `secondary-sidebar ${activeMenu ? "is-open" : ""}`;
  const currentMenu = menuConfig[activeMenu];

  // LOG CRÍTICO 3: Mostra o estado exato no momento da renderização
  console.log(`[SecondarySidebar] RENDERIZANDO COM DADOS:`, { loading, user });

  if (!currentMenu) {
    return <div className={finalClassName}></div>;
  }

  if (loading) {
    return (
      <div className={finalClassName}>
        <div className="menu-content is-visible">
          <h3>{currentMenu.title}</h3>
          <p>A verificar permissões...</p>
        </div>
      </div>
    );
  }

  const isWebmaster = user?.credencialAcesso === "Webmaster";
  if (currentMenu.adminOnly && !isWebmaster) {
    return null;
  }

  return (
    <div className={finalClassName}>
      <div className="menu-content is-visible">
        <h3>{currentMenu.title}</h3>
        <ul className="secondary-menu">
          {currentMenu.items.map((item) => {
            if (!item.permission || hasPermission(item.permission)) {
              return (
                <li key={item.path}>
                  <NavLink to={item.path}>{item.label}</NavLink>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    </div>
  );
};

export default SecondarySidebar;
