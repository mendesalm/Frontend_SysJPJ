// src/components/layout/NewDashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MainSidebar from './MainSidebar';
import SecondarySidebar from './SecondarySidebar';
import './NewDashboard.css'; // Importa o novo CSS

const NewDashboardLayout = () => {
    const [activeMenu, setActiveMenu] = useState('menu-usuario'); // Começa com o menu do usuário aberto

    const handleMenuClick = (menuId) => {
        // Se clicar no mesmo ícone, fecha o menu. Senão, abre o novo.
        setActiveMenu(prevMenu => (prevMenu === menuId ? null : menuId));
    };

    return (
        <div className="new-dashboard-layout">
            <MainSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
            <SecondarySidebar activeMenu={activeMenu} />
            <main className="new-dashboard-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default NewDashboardLayout;
