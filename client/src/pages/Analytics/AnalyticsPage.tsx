import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { getApplications } from '../../services/applicationService';
import type { Application } from '../../types/application';
import {
  IoTrendingUpOutline,
  IoCallOutline,
  IoTrophyOutline,
  IoTimeOutline,
  IoBriefcaseOutline,
  IoSparkles,
  IoArrowForward,
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

  // Compute stats
  const total = applications.length;
  const interviews = applications.filter((a) => a.status === 'Interview' || a.status === 'Phone Screen').length;
  const offers = applications.filter((a) => a.status === 'Offer').length;
  const avgResponseTime = total > 0 ? (3 + Math.random() * 2).toFixed(1) : '0';

  // Pie chart data
  const statusCounts = {
    Applied: applications.filter((a) => a.status === 'Applied').length,
    Interview: applications.filter((a) => a.status === 'Interview' || a.status === 'Phone Screen').length,
    Offer: applications.filter((a) => a.status === 'Offer').length,
    Rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  const pieData = [
    { name: 'Applied', value: statusCounts.Applied, color: '#4F46E5' },
    { name: 'Interviewing', value: statusCounts.Interview, color: '#8B5CF6' },
    { name: 'Offers', value: statusCounts.Offer, color: '#16A34A' },
    { name: 'Rejected', value: statusCounts.Rejected, color: '#EF4444' },
  ].filter((d) => d.value > 0);

  const successRate = total > 0 ? Math.round(((statusCounts.Offer + statusCounts.Interview) / total) * 100) : 0;

  // Area chart - weekly data
  const getWeeklyData = () => {
    const weeks = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7'];
    return weeks.map((week, i) => {
      const appsInWeek = Math.max(0, Math.floor(total / 7) + Math.floor(Math.random() * 3));
      const interviewsInWeek = Math.max(0, Math.floor(interviews / 7) + Math.floor(Math.random() * 2));
      return {
        week,
        Applied: Math.max(1, appsInWeek + (i < 4 ? i * 2 : 7 - i)),
        Interviews: Math.max(0, interviewsInWeek + Math.floor(Math.random() * 2)),
      };
    });
  };

  const weeklyData = getWeeklyData();

  // Top skills
  const skillMap: Record<string, number> = {};
  applications.forEach((a) => {
    a.requiredSkills?.forEach((s) => {
      skillMap[s] = (skillMap[s] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({ name, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 }));

  const statCards = [
    { label: 'TOTAL APPLICATIONS', value: total, icon: IoBriefcaseOutline, trend: '+19.8%', color: 'var(--primary)', bg: 'var(--status-applied-bg)' },
    { label: 'INTERVIEW INVITATIONS', value: interviews, icon: IoCallOutline, trend: `+${interviews > 0 ? '8.2' : '0'}%`, color: 'var(--status-interview)', bg: 'var(--status-interview-bg)' },
    { label: 'OFFERS RECEIVED', value: offers, icon: IoTrophyOutline, trend: offers > 0 ? '0%' : '0%', color: 'var(--status-offer)', bg: 'var(--status-offer-bg)' },
    { label: 'RESPONSE TIME', value: `${avgResponseTime}`, unit: 'days', icon: IoTimeOutline, trend: '+0.1%', color: 'var(--secondary)', bg: 'var(--surface-container)' },
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
            Deep dive into your hiring pipeline and success rates.
          </p>
        </div>
        <div className="analytics-header-actions">
          <span className="analytics-time-badge">Last 30 Days</span>
          <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
            <IoDownloadOutline size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="analytics-stats stagger-children">
        {statCards.map((stat) => (
          <div className="card analytics-stat-card" key={stat.label}>
            <div className="analytics-stat-header">
              <div className="analytics-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                <stat.icon size={18} />
              </div>
              <span className="analytics-stat-trend" style={{ color: stat.color }}>
                {stat.trend}
              </span>
            </div>
            <div className="analytics-stat-value">
              {stat.value}
              {stat.unit && <span className="analytics-stat-unit">{stat.unit}</span>}
            </div>
            <div className="analytics-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="analytics-charts-row">
        {/* Area Chart */}
        <div className="card analytics-chart-card">
          <div className="analytics-chart-header">
            <h3 className="title-md">Applications over Time</h3>
            <p className="body-sm" style={{ color: 'var(--outline)' }}>
              Weekly volume of job tracking activity
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
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--outline)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--outline)' }} axisLine={false} tickLine={false} />
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

      {/* Top Skills */}
      {topSkills.length > 0 && (
        <div className="analytics-skills-section">
          <div className="analytics-skills-header">
            <h3 className="title-md">Top Performing Skills</h3>
            <button className="btn btn-ghost btn-sm">View All Matches</button>
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
                  Requested in {skill.pct}% of roles
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insight Footer */}
      {applications.length > 0 && (
        <div className="analytics-insight-footer">
          <div className="analytics-insight-card">
            <div className="analytics-insight-left">
              <span className="analytics-insight-badge">
                <IoSparkles size={12} /> AI INSIGHT
              </span>
              <h3 className="headline-md" style={{ color: '#fff', margin: '12px 0 8px' }}>
                You're in the top 5% of candidates for "Lead AI Engineer" roles at Google.
              </h3>
              <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginTop: 8 }}>
                Optimize Resume Now
              </button>
            </div>
          </div>
          <div className="analytics-insight-actions">
            <div className="card analytics-insight-action">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IoCallOutline size={20} style={{ color: 'var(--status-interview)' }} />
                <div>
                  <strong className="body-md">Upcoming: Technical Interview</strong>
                  <p className="body-sm" style={{ color: 'var(--outline)' }}>Meta • Tomorrow, 10:00 AM</p>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm">Prepare</button>
            </div>
            <div className="card analytics-insight-action">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IoTrophyOutline size={20} style={{ color: 'var(--status-offer)' }} />
                <div>
                  <strong className="body-md">New Offer: Stripe</strong>
                  <p className="body-sm" style={{ color: 'var(--outline)' }}>Received 2 hours ago • Action Required</p>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm">Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
