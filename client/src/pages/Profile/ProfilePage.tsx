import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getApplications } from '../../services/applicationService';
import api from '../../config/api';
import type { Application } from '../../types/application';
import {
  IoPersonOutline,
  IoMailOutline,
  IoLockClosedOutline,
  IoCalendarOutline,
  IoShieldCheckmarkOutline,
  IoCreateOutline,
  IoBriefcaseOutline,
  IoTrophyOutline,
  IoBarChartOutline,
  IoCheckmarkCircle,
} from 'react-icons/io5';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Edit form
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch {
      // silent — stats are supplementary
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put('/users/me', { name: editName, email: editEmail });
      // Update localStorage
      const updatedUser = { ...user, name: editName, email: editEmail };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload();
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await api.put('/users/me/password', {
        currentPassword,
        newPassword,
      });
      showToast('Password changed successfully!', 'success');
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Compute real stats
  const totalApps = applications.length;
  const interviews = applications.filter((a) => a.status === 'Interview' || a.status === 'Phone Screen').length;
  const offers = applications.filter((a) => a.status === 'Offer').length;
  const conversionRate = totalApps > 0 ? Math.round(((interviews + offers) / totalApps) * 100) : 0;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';



  return (
    <div className="profile-page animate-fade-in">
      {/* Profile Header */}
      <div className="profile-header-card card">
        <div className="profile-header-bg" />
        <div className="profile-header-content">
          <div className="profile-avatar-lg">{initials}</div>
          <div className="profile-header-info">
            <h1 className="headline-lg">{user?.name || 'User'}</h1>
            <p className="body-md" style={{ color: 'var(--outline)' }}>{user?.email}</p>
            <div className="profile-header-badges">
              <span className="profile-badge">
                <IoShieldCheckmarkOutline size={14} />
                Verified Account
              </span>
              <span className="profile-badge">
                <IoCalendarOutline size={14} />
                Active Member
              </span>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm profile-edit-btn"
            onClick={() => {
              setIsEditing(!isEditing);
              setIsChangingPassword(false);
            }}
          >
            <IoCreateOutline size={16} />
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="profile-grid">
        {/* Left Column */}
        <div className="profile-left">
          {/* Quick Stats */}
          <div className="card profile-stats-card">
            <h3 className="title-md" style={{ marginBottom: 'var(--space-lg)' }}>Your Numbers</h3>
            <div className="profile-stats-grid">
              <div className="profile-stat">
                <div className="profile-stat-icon" style={{ background: 'var(--status-applied-bg)', color: 'var(--primary)' }}>
                  <IoBriefcaseOutline size={18} />
                </div>
                <div>
                  <span className="profile-stat-value">{totalApps}</span>
                  <span className="profile-stat-label">Applications</span>
                </div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-icon" style={{ background: 'var(--status-interview-bg)', color: 'var(--status-interview)' }}>
                  <IoBarChartOutline size={18} />
                </div>
                <div>
                  <span className="profile-stat-value">{interviews}</span>
                  <span className="profile-stat-label">Interviews</span>
                </div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-icon" style={{ background: 'var(--status-offer-bg)', color: 'var(--status-offer)' }}>
                  <IoTrophyOutline size={18} />
                </div>
                <div>
                  <span className="profile-stat-value">{offers}</span>
                  <span className="profile-stat-label">Offers</span>
                </div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
                  <IoCheckmarkCircle size={18} />
                </div>
                <div>
                  <span className="profile-stat-value">{conversionRate}%</span>
                  <span className="profile-stat-label">Conversion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="card profile-security-card">
            <div className="profile-security-header">
              <h3 className="title-md">Security</h3>
              {!isChangingPassword && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setIsChangingPassword(true);
                    setIsEditing(false);
                  }}
                >
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handleChangePassword} className="profile-password-form">
                <div className="input-group">
                  <label>Current Password</label>
                  <div className="profile-input-wrapper">
                    <IoLockClosedOutline size={16} className="profile-input-icon" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="Enter current password"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>New Password</label>
                  <div className="profile-input-wrapper">
                    <IoLockClosedOutline size={16} className="profile-input-icon" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Min. 6 characters"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Confirm New Password</label>
                  <div className="profile-input-wrapper">
                    <IoLockClosedOutline size={16} className="profile-input-icon" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>
                <div className="profile-password-actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setIsChangingPassword(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? <span className="spinner" /> : 'Update Password'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-security-info">
                <div className="profile-security-row">
                  <IoLockClosedOutline size={16} />
                  <span className="body-md">Password</span>
                  <span className="body-sm" style={{ color: 'var(--outline)', marginLeft: 'auto' }}>••••••••</span>
                </div>
                <div className="profile-security-row">
                  <IoShieldCheckmarkOutline size={16} />
                  <span className="body-md">Two-Factor Auth</span>
                  <span className="status-badge applied" style={{ marginLeft: 'auto', fontSize: '0.6875rem' }}>Coming Soon</span>
                </div>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="card profile-danger-card">
            <h3 className="title-md" style={{ color: 'var(--error)' }}>Danger Zone</h3>
            <p className="body-sm" style={{ color: 'var(--outline)', margin: 'var(--space-sm) 0 var(--space-lg)' }}>
              Sign out of your account on this device.
            </p>
            <button className="btn btn-danger btn-sm" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Right Column — Edit Form */}
        <div className="profile-right">
          <div className="card profile-details-card">
            <h3 className="title-md" style={{ marginBottom: 'var(--space-xl)' }}>
              {isEditing ? 'Edit Profile' : 'Account Details'}
            </h3>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="input-group">
                  <label>Full Name</label>
                  <div className="profile-input-wrapper">
                    <IoPersonOutline size={16} className="profile-input-icon" />
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      minLength={2}
                    />
                  </div>
                </div>
                <div className="input-group" style={{ marginTop: 'var(--space-lg)' }}>
                  <label>Email Address</label>
                  <div className="profile-input-wrapper">
                    <IoMailOutline size={16} className="profile-input-icon" />
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(user?.name || '');
                      setEditEmail(user?.email || '');
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? <span className="spinner" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details-rows">
                <div className="profile-detail-row">
                  <div className="profile-detail-icon">
                    <IoPersonOutline size={16} />
                  </div>
                  <div>
                    <span className="label-md">Full Name</span>
                    <span className="body-md">{user?.name || '—'}</span>
                  </div>
                </div>
                <div className="profile-detail-row">
                  <div className="profile-detail-icon">
                    <IoMailOutline size={16} />
                  </div>
                  <div>
                    <span className="label-md">Email</span>
                    <span className="body-md">{user?.email || '—'}</span>
                  </div>
                </div>
                <div className="profile-detail-row">
                  <div className="profile-detail-icon">
                    <IoCalendarOutline size={16} />
                  </div>
                  <div>
                    <span className="label-md">Account ID</span>
                    <span className="body-sm" style={{ color: 'var(--outline)' }}>{user?.id || '—'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
