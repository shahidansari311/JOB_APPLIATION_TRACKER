import React, { useEffect, useState, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';
import { getApplications } from '../../services/applicationService';
import type { Application } from '../../types/application';
import {
  IoCallOutline,
  IoTrophyOutline,
  IoTimeOutline,
  IoBriefcaseOutline,
  IoDownloadOutline,
} from 'react-icons/io5';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import './AnalyticsPage.css';

const AnalyticsPage: React.FC = () => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch {
      showToast('Failed to load analytics data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // All stats derived from real data
  const total = applications.length;
  const interviews = applications.filter((a) => a.status === 'Interview' || a.status === 'Phone Screen').length;
  const offers = applications.filter((a) => a.status === 'Offer').length;
  const rejected = applications.filter((a) => a.status === 'Rejected').length;
  const applied = applications.filter((a) => a.status === 'Applied').length;

  // Pie chart data from real counts
  const pieData = useMemo(() => [
    { name: 'Applied', value: applied, color: '#4F46E5' },
    { name: 'Interviewing', value: interviews, color: '#8B5CF6' },
    { name: 'Offers', value: offers, color: '#16A34A' },
    { name: 'Rejected', value: rejected, color: '#EF4444' },
  ].filter((d) => d.value > 0), [applied, interviews, offers, rejected]);

  const successRate = total > 0 ? Math.round(((offers + interviews) / total) * 100) : 0;

  // Area chart — real monthly data grouped by month
  const monthlyData = useMemo(() => {
    if (applications.length === 0) return [];

    const monthMap: Record<string, { Applied: number; Interviews: number }> = {};
    applications.forEach((app) => {
      const date = new Date(app.dateApplied);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!monthMap[key]) monthMap[key] = { Applied: 0, Interviews: 0 };
      monthMap[key].Applied += 1;
      if (app.status === 'Interview' || app.status === 'Phone Screen') {
        monthMap[key].Interviews += 1;
      }
    });

    return Object.entries(monthMap)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([month, counts]) => ({ month, ...counts }));
  }, [applications]);

  // Top skills from real parsed data
  const topSkills = useMemo(() => {
    const skillMap: Record<string, number> = {};
    applications.forEach((a) => {
      a.requiredSkills?.forEach((s) => {
        skillMap[s] = (skillMap[s] || 0) + 1;
      });
    });
    return Object.entries(skillMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({
        name,
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
      }));
  }, [applications, total]);

  const statCards = [
    { label: 'TOTAL APPLICATIONS', value: total, icon: IoBriefcaseOutline, color: 'var(--primary)', bg: 'var(--status-applied-bg)' },
    { label: 'INTERVIEW INVITATIONS', value: interviews, icon: IoCallOutline, color: 'var(--status-interview)', bg: 'var(--status-interview-bg)' },
    { label: 'OFFERS RECEIVED', value: offers, icon: IoTrophyOutline, color: 'var(--status-offer)', bg: 'var(--status-offer-bg)' },
    { label: 'REJECTED', value: rejected, icon: IoTimeOutline, color: 'var(--status-rejected)', bg: 'var(--status-rejected-bg)' },
  ];

  const handleExportCSV = () => {
    if (applications.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }
    const headers = ['Company', 'Role', 'Status', 'Date Applied', 'Location', 'Salary Range'];
    const rows = applications.map((a) => [
      a.company, a.role, a.status, new Date(a.dateApplied).toLocaleDateString(), a.location || '', a.salaryRange || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications_export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully!', 'success');
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className="analytics-page animate-fade-in">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1 className="headline-lg">Application Analytics</h1>
          <p className="body-md" style={{ color: 'var(--outline)', marginTop: 4 }}>
            {total > 0
              ? `Analyzing ${total} application${total !== 1 ? 's' : ''} in your pipeline.`
              : 'No applications to analyze yet. Start tracking!'}
          </p>
        </div>
        {total > 0 && (
          <div className="analytics-header-actions">
            <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
              <IoDownloadOutline size={16} />
              Export Report
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="analytics-stats stagger-children">
        {statCards.map((stat) => (
          <div className="card analytics-stat-card" key={stat.label}>
            <div className="analytics-stat-header">
              <div className="analytics-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="analytics-stat-value">{stat.value}</div>
            <div className="analytics-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {total === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">
            <IoBriefcaseOutline size={32} />
          </div>
          <p className="body-md" style={{ color: 'var(--outline)' }}>
            Add some job applications to see your analytics and charts here.
          </p>
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="analytics-charts-row">
            {/* Area Chart */}
            <div className="card analytics-chart-card">
              <div className="analytics-chart-header">
                <h3 className="title-md">Applications over Time</h3>
                <p className="body-sm" style={{ color: 'var(--outline)' }}>
                  Monthly volume of job tracking activity
                </p>
              </div>
              <div className="analytics-chart-legend">
                <span className="analytics-legend-item">
                  <span className="analytics-legend-dot" style={{ background: 'var(--primary)' }} />
                  Applied
                </span>
                <span className="analytics-legend-item">
                  <span className="analytics-legend-dot" style={{ background: 'var(--status-interview)' }} />
                  Interviews
                </span>
              </div>
              <div className="analytics-chart-container">
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradApplied" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradInterview" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-container)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--outline)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: 'var(--outline)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--surface-container-lowest)',
                          border: 'none',
                          borderRadius: 12,
                          boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
                          fontSize: 13,
                        }}
                      />
                      <Area type="monotone" dataKey="Applied" stroke="#4F46E5" strokeWidth={2.5} fill="url(#gradApplied)" />
                      <Area type="monotone" dataKey="Interviews" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="4 4" fill="url(#gradInterview)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="body-sm" style={{ color: 'var(--outline)', textAlign: 'center', padding: 'var(--space-2xl)' }}>
                    Not enough data for timeline chart.
                  </p>
                )}
              </div>
            </div>

            {/* Donut Chart */}
            <div className="card analytics-donut-card">
              <h3 className="title-md">Status Mix</h3>
              <p className="body-sm" style={{ color: 'var(--outline)', marginBottom: 'var(--space-lg)' }}>
                Current pipeline distribution
              </p>
              <div className="analytics-donut-wrapper">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={pieData.length > 0 ? pieData : [{ name: 'Empty', value: 1, color: '#E1E3E4' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {(pieData.length > 0 ? pieData : [{ name: 'Empty', value: 1, color: '#E1E3E4' }]).map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="analytics-donut-center">
                  <span className="analytics-donut-value">{successRate}%</span>
                  <span className="analytics-donut-label">SUCCESS RATE</span>
                </div>
              </div>
              <div className="analytics-donut-legend">
                {pieData.map((d) => (
                  <div className="analytics-donut-legend-item" key={d.name}>
                    <span className="analytics-legend-dot" style={{ background: d.color }} />
                    <span className="body-sm">{d.name}</span>
                    <span className="body-sm" style={{ marginLeft: 'auto', fontWeight: 600 }}>
                      {total > 0 ? Math.round((d.value / total) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Skills — only if data exists */}
          {topSkills.length > 0 && (
            <div className="analytics-skills-section">
              <div className="analytics-skills-header">
                <h3 className="title-md">Most Requested Skills</h3>
              </div>
              <div className="analytics-skills-grid stagger-children">
                {topSkills.map((skill) => (
                  <div className="card analytics-skill-card" key={skill.name}>
                    <div className="analytics-skill-icon-wrapper">
                      <div className="analytics-skill-icon">
                        {skill.name.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <strong className="title-md">{skill.name}</strong>
                    <span className="body-sm" style={{ color: 'var(--outline)' }}>
                      Found in {skill.count} of {total} application{total !== 1 ? 's' : ''} ({skill.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
