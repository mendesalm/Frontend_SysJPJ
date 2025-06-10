// src/components/layout/SecondarySidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Define a estrutura de todos os sub-menus
const menuData = {
    'menu-usuario': {
        title: 'Painel do Usuário',
        items: [
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Meus Dados Pessoais', path: '/perfil' },
            { label: 'Mural de Avisos', path: '/mural-de-avisos' },
            { label: 'Publicações', path: '/publicacoes' },
        ]
    },
    'menu-secretaria': {
        title: 'Secretaria',
        items: [
            { label: 'Gestão de Membros', path: '/admin/members' },
            { label: 'Gestão de Atas', path: '/sessoes' }, // Assumindo que atas estão em sessões
            { label: 'Gestão de Publicações', path: '/publicacoes' },
        ]
    },
    'menu-chancelaria': {
        title: 'Chancelaria',
        items: [
            { label: 'Dados de Membros', path: '/admin/members' },
            { label: 'Gestão de Sessões', path: '/sessoes' },
            { label: 'Controle de Frequência', path: '/relatorios' }, // Link para a página geral de relatórios
        ]
    },
    'menu-tesouraria': {
        title: 'Tesouraria',
        items: [
            { label: 'Plano de Contas', path: '/financeiro/plano-contas' },
            { label: 'Lançamentos', path: '/financeiro/lancamentos' },
            { label: 'Orçamento', path: '/financeiro/orcamento' },
        ]
    },
    'menu-biblioteca': {
        title: 'Biblioteca',
        items: [
            { label: 'Acervo', path: '/biblioteca' },
            // Empréstimos podem ser parte da página de acervo
        ]
    },
    'menu-harmonia': {
        title: 'Harmonia',
        items: [
            { label: 'Player de Harmonia', path: '/player-harmonia' },
            { label: 'Gestão de Músicas', path: '/harmonia' },
        ]
    },
    'menu-webmaster': {
        title: 'Webmaster',
        items: [
            { label: 'Gestão de Permissões', path: '/admin/permissions' },
            { label: 'Configurações Gerais', path: '#' }, // Placeholder
        ],
        adminOnly: true
    },
};

const SecondarySidebar = ({ activeMenu }) => {
    const { user } = useAuth();
    
    // CORREÇÃO: A variável 'currentMenu' foi removida, pois não estava a ser utilizada.
    
    const isWebmaster = user?.credencialAcesso === 'Webmaster';

    const shouldRenderMenu = (menu) => {
        if (!menu) return false;
        if (menu.adminOnly && !isWebmaster) return false;
        return true;
    };

    return (
        <div className={`secondary-sidebar ${activeMenu ? 'is-open' : ''}`}>
            {Object.entries(menuData).map(([key, menu]) => {
                if (!shouldRenderMenu(menu)) return null;
                return (
                    <div key={key} id={key} className={`menu-content ${activeMenu === key ? 'is-visible' : ''}`}>
                        <h3>{menu.title}</h3>
                        <ul className="secondary-menu">
                            {menu.items.map(item => (
                                <li key={item.path}>
                                    <NavLink to={item.path}>{item.label}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            })}
        </div>
    );
};

export default SecondarySidebar;
