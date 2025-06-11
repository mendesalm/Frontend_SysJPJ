// src/components/layout/MainSidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const IconUsuario = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconSecretaria = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3l4 4L7 21l-4-4L17 3z"></path><path d="M7 3l4 4L3 21l-4-4L7 3z"></path><path d="M14 8L6 16"></path></svg>;
const IconChancelaria = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><circle cx="10.5" cy="15.5" r="2.5"></circle><path d="m16 10-5.5 5.5"></path></svg>;
const IconTesouraria = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2.5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1 5 0Z"></path><path d="M12 10.5V15l-2.5-2.5L7 15V5"></path><path d="M9.5 2.5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1 5 0Z"></path><path d="M7 10.5V15l2.5-2.5L12 15V5"></path></svg>;
const IconBiblioteca = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const IconHarmonia = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 6V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"></path><path d="M8 6v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6"></path><path d="M7 8h10"></path><path d="M7 12h10"></path><path d="M7 16h10"></path></svg>;
const IconWebmaster = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

const MainSidebar = ({ activeMenu, onMenuClick }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    console.log('[MainSidebar] Renderizou com a prop activeMenu:', activeMenu);

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const menuItems = [
        { id: 'menu-usuario', tooltip: 'Painel do Usuário', icon: <IconUsuario /> },
        { id: 'menu-secretaria', tooltip: 'Secretaria', icon: <IconSecretaria /> },
        { id: 'menu-chancelaria', tooltip: 'Chancelaria', icon: <IconChancelaria /> },
        { id: 'menu-tesouraria', tooltip: 'Tesouraria', icon: <IconTesouraria /> },
        { id: 'menu-biblioteca', tooltip: 'Biblioteca', icon: <IconBiblioteca /> },
        { id: 'menu-harmonia', tooltip: 'Harmonia', icon: <IconHarmonia /> },
    ];
    
    return (
        <nav className="main-sidebar">
            <Link to="/dashboard" className="main-sidebar-logo">JPJ</Link>
            <ul className="main-menu">
                {menuItems.map(item => (
                    <li key={item.id} className="main-menu-item">
                        <button 
                            className={`main-menu-button ${activeMenu === item.id ? 'active' : ''}`}
                            onClick={() => onMenuClick(item.id)}
                        >
                            {item.icon}
                            <span className="tooltip">{item.tooltip}</span>
                        </button>
                    </li>
                ))}
            </ul>
            <div className="main-sidebar-footer">
                 <button className={`main-menu-button ${activeMenu === 'menu-webmaster' ? 'active' : ''}`}
                    onClick={() => onMenuClick('menu-webmaster')}>
                    <IconWebmaster />
                    <span className="tooltip">Webmaster</span>
                </button>
                 <button className="logout-button" onClick={handleLogout}>
                    <IconLogout />
                    <span className="tooltip">Sair</span>
                </button>
            </div>
        </nav>
    );
};

export default MainSidebar;
