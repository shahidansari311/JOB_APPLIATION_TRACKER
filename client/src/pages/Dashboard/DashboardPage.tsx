import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getApplications } from '../../services/applicationService';
import { useNavigate } from 'react-router-dom';
import type { Application, DashboardStats } from '../../types/application';
import { STATUS_CONFIG } from '../../types/application';
import {
  IoPlayOutline,
  IoCallOutline,
  IoTrophyOutline,
  IoCloseCircleOutline,
  IoSparkles,
  IoArrowForward,
  IoBriefcaseOutline,
} from 'react-icons/io5';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0, applied: 0, phoneScreen: 0, interview: 0, offer: 0, rejected: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
      setStats({
        total: data.length,
        applied: data.filter((a) => a.status === 'Applied').length,
        phoneScreen: data.filter((a) => a.status === 'Phone Screen').length,
        interview: data.filter((a) => a.status === 'Interview').length,
        offer: data.filter((a) => a.status === 'Offer').length,
        rejected: data.filter((a) => a.status === 'Rejected').length,
      });
    } catch {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'User';
  const recentApps = applications.slice(0, 5);

  // Compute real skill frequency from applications
  const skillMap: Record<string, number> = {};
  applications.forEach((a) => {
    a.requiredSkills?.forEach((s) => {
      skillMap[s] = (skillMap[s] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({
      name,
      pct: stats.total > 0 ? Math.round((count / stats.total) * 100) : 0,
    }));

  // Interview conversion rate (real)
  const interviewRate = stats.total > 0
    ? Math.round(((stats.interview + stats.offer) / stats.total) * 100)
    : 0;

  const statCards = [
    {
      label: 'Total Applications',
      value: stats.total,
      icon: IoBriefcaseOutline,
      color: 'var(--primary)',
      bg: 'var(--status-applied-bg)',
    },
    {
      label: 'Interviews',
      value: stats.interview + stats.phoneScreen,
      icon: IoCallOutline,
      color: 'var(--status-interview)',
      bg: 'var(--status-interview-bg)',
    },
    {
      label: 'Offers Received',
      value: stats.offer,
      icon: IoTrophyOutline,
      color: 'var(--status-offer)',
      bg: 'var(--status-offer-bg)',
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: IoCloseCircleOutline,
      color: 'var(--status-rejected)',
      bg: 'var(--status-rejected-bg)',
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className="dashboard animate-fade-in">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="headline-lg">Career Overview</h1>
          <p className="body-md" style={{ color: 'var(--outline)', marginTop: 4 }}>
            Welcome back, {firstName}.
            {stats.total > 0
              ? ` You're tracking ${stats.total} application${stats.total !== 1 ? 's' : ''}.`
              : ' Start tracking your job applications.'}
          </p>
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/add-job')}
        >
          <IoPlayOutline size={18} />
          Track New Application
        </button>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats stagger-children">
        {statCards.map((stat) => (
          <div className="dash-stat-card card" key={stat.label}>
            <div className="dash-stat-header">
              <div
                className="dash-stat-icon"
                style={{ background: stat.bg, color: stat.color }}
              >
                <stat.icon size={20} />
              </div>
            </div>
            <div className="dash-stat-value">{stat.value}</div>
            <div className="dash-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* AI Insights — only show if data exists */}
        <div className="card dash-insights-card">
          <div className="dash-insights-header">
            <IoSparkles size={18} style={{ color: 'var(--primary)' }} />
            <h3 className="title-md">Pipeline Insights</h3>
          </div>

          <div className="dash-score-ring">
            <svg viewBox="0 0 120 120" className="dash-score-svg">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--surface-container)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(interviewRate / 100) * 327} 327`}
                transform="rotate(-90 60 60)"
                className="dash-score-progress"
              />
            </svg>
            <div className="dash-score-text">
              <span className="dash-score-value">{interviewRate}%</span>
              <span className="dash-score-label">CONVERSION RATE</span>
            </div>
          </div>

          {topSkills.length > 0 ? (
            <div className="dash-skill-bars">
              {topSkills.map((skill) => (
                <div className="dash-skill-bar" key={skill.name}>
                  <span className="dash-skill-name">{skill.name}</span>
                  <div className="dash-skill-track">
                    <div className="dash-skill-fill" style={{ width: `${skill.pct}%` }} />
                  </div>
                  <span className="dash-skill-pct">{skill.pct}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="body-sm" style={{ color: 'var(--outline)', textAlign: 'center' }}>
              Add applications with AI parsing to see skill insights.
            </p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card dash-activity-card">
          <div className="dash-activity-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IoBriefcaseOutline size={18} style={{ color: 'var(--primary)' }} />
              <h3 className="title-md">Recent Activity</h3>
            </div>
            {applications.length > 0 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/applications')}
              >
                View All
              </button>
            )}
          </div>

          {recentApps.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-2xl)' }}>
              <div className="empty-state-icon">
                <IoBriefcaseOutline size={32} />
              </div>
              <p className="body-md" style={{ color: 'var(--outline)' }}>
                No applications yet. Click "Track New Application" to get started!
              </p>
            </div>
          ) : (
            <div className="dash-activity-table">
              <div className="dash-activity-row dash-activity-header-row">
                <span>JOB TITLE</span>
                <span>COMPANY</span>
                <span>STATUS</span>
                <span>DATE</span>
              </div>
              {recentApps.map((app) => (
                <div
                  className="dash-activity-row"
                  key={app._id}
                  onClick={() => navigate('/applications')}
                >
                  <div className="dash-activity-job">
                    <div
                      className="dash-activity-job-icon"
                      style={{
                        background: STATUS_CONFIG[app.status]?.bg || 'var(--surface-container)',
                        color: STATUS_CONFIG[app.status]?.color || 'var(--primary)',
                      }}
                    >
                      {app.company?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="title-md">{app.role}</span>
                  </div>
                  <span className="body-md">{app.company}</span>
                  <span className={`status-badge ${STATUS_CONFIG[app.status]?.cssClass || ''}`}>
                    {app.status}
                  </span>
                  <span className="body-sm" style={{ color: 'var(--outline)' }}>
                    {formatDate(app.dateApplied)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {applications.length > 5 && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', marginTop: 'var(--space-md)' }}
              onClick={() => navigate('/applications')}
            >
              Show More Applications
              <IoArrowForward size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
