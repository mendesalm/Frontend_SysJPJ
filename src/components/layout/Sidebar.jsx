import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

// Ícone SVG para o menu suspenso
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);


const Sidebar = () => {
  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState('');

  const isAdmin = user?.credencialAcesso === 'Webmaster' || user?.credencialAcesso === 'Diretoria';
  const isWebmaster = user?.credencialAcesso === 'Webmaster';

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Meu Perfil', path: '/perfil' },
    { label: 'Mural de Avisos', path: '/mural-de-avisos' },
    { label: 'Eventos', path: '/eventos' },
    { label: 'Publicações', path: '/publicacoes' },
    { label: 'Biblioteca', path: '/biblioteca' },
    { label: 'Player de Harmonia', path: '/player-harmonia' },
  ];
  
  const adminMenus = {
    'Administração': [
       { label: 'Gestão de Membros', path: '/admin/members' },
       { label: 'Gestão de Sessões', path: '/sessoes' },
       { label: 'Gestão de Comissões', path: '/comissoes' },
       { label: 'Gestão de Património', path: '/patrimonio' },
       { label: 'Gestão de Harmonia', path: '/harmonia' },
       { label: 'Relatórios', path: '/relatorios' },
       isWebmaster && { label: 'Gestão de Permissões', path: '/admin/permissions' },
    ].filter(Boolean),
    'Financeiro': [
       { label: 'Plano de Contas', path: '/financeiro/plano-contas' },
       { label: 'Lançamentos', path: '/financeiro/lancamentos' },
       { label: 'Orçamento', path: '/financeiro/orcamento' },
    ]
  };

  const handleMenuToggle = (menuLabel) => {
    setOpenMenu(openMenu === menuLabel ? '' : menuLabel);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard">
          <h3>SysJPJ</h3>
        </Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li key={item.path}>
              <NavLink to={item.path}>{item.label}</NavLink>
            </li>
          ))}
          
          {isAdmin && Object.entries(adminMenus).map(([title, subItems]) => (
            <li key={title} className="nav-group">
              <button onClick={() => handleMenuToggle(title)} className="group-toggle">
                <span>{title}</span>
                <span className={`chevron-icon ${openMenu === title ? 'open' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>
              <ul className={`submenu ${openMenu === title ? 'open' : ''}`}>
                {subItems.map(item => (
                  <li key={item.path}>
                    <NavLink to={item.path}>{item.label}</NavLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      {/* SECÇÃO DE DEBUG ADICIONADA AO RODAPÉ */}
      <div className="sidebar-footer">
        {user && (
            <div className="user-info-debug">
                <p><strong>Utilizador:</strong> {user.NomeCompleto}</p>
                <p><strong>Credencial:</strong> <span className="debug-credential">{user.credencialAcesso}</span></p>
            </div>
        )}
        <button onClick={logout} className="logout-button">Sair</button>
      </div>
    </aside>
  );
};

export default Sidebar;
