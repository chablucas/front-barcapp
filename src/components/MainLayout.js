import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const noHeaderRoutes = ['/login', '/register', '/google-auth'];
  const hideHeader = noHeaderRoutes.includes(location.pathname);

  return (
    <div className="main-layout">
      {!hideHeader && <Header />}
      <div className="main-body">
        <Sidebar />
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
