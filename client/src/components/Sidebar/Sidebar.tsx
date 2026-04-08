import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  IoGridOutline,
  IoAddCircleOutline,
  IoDocumentTextOutline,
  IoBarChartOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoSparkles,
} from 'react-icons/io5';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: IoGridOutline },
    { path: '/add-job', label: 'Add Job', icon: IoAddCircleOutline },
    { path: '/applications', label: 'Applications', icon: IoDocumentTextOutline },
    { path: '/analytics', label: 'Analytics', icon: IoBarChartOutline },
    { path: '/profile', label: 'Profile', icon: IoPersonOutline },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <IoSparkles size={20} />
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">Curator AI</span>
            <span className="sidebar-brand-sub">WORKSPACE</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="sidebar-nav-item" onClick={logout}>
            <IoLogOutOutline size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
