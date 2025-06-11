// src/components/layout/NewDashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MainSidebar from './MainSidebar';
import SecondarySidebar from './SecondarySidebar';
import './NewDashboard.css';

const NewDashboardLayout = () => {
    const [activeMenu, setActiveMenu] = useState('menu-usuario');
    const location = useLocation();

    // Fecha o menu secundário sempre que a rota muda
    useEffect(() => {
        // Esta lógica pode ser removida se preferir que o menu continue aberto ao navegar
        const secondarySidebar = document.querySelector('.secondary-sidebar');
        if (secondarySidebar && secondarySidebar.classList.contains('is-open')) {
             // setActiveMenu(null); // Descomente para fechar o menu ao navegar
        }
    }, [location]);
    
    console.log('%c[Layout Pai] Renderizou. Estado activeMenu:', 'color: lightblue;', activeMenu);

    const handleMenuClick = (menuId) => {
        console.log(`%c[Layout Pai] Clique recebido para: ${menuId}`, 'color: yellow; font-weight: bold;');
        setActiveMenu(prevMenu => {
            const newMenu = prevMenu === menuId ? null : menuId;
            console.log(`%c[Layout Pai] Estado a mudar de '${prevMenu}' para '${newMenu}'`, 'color: orange;');
            return newMenu;
        });
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
