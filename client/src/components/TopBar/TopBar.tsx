import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { IoSearchOutline, IoSettingsOutline, IoNotificationsOutline } from 'react-icons/io5';
import './TopBar.css';

const TopBar: React.FC = () => {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="topbar">
      <div className="topbar-search">
        <IoSearchOutline size={18} className="topbar-search-icon" />
        <input
          type="text"
          placeholder="Search applications..."
          className="topbar-search-input"
        />
      </div>

      <div className="topbar-actions">
        <button className="btn-icon btn-ghost topbar-action-btn">
          <IoSettingsOutline size={20} />
        </button>
        <button className="btn-icon btn-ghost topbar-action-btn">
          <IoNotificationsOutline size={20} />
        </button>
        <div className="topbar-user">
          <div className="topbar-avatar">{initials}</div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">{user?.name || 'User'}</span>
            <span className="topbar-user-role">Design Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
