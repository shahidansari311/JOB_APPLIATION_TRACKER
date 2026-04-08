import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import {
  getApplications,
  deleteApplication,
  updateApplication,
} from '../../services/applicationService';
import type { Application, ApplicationStatus } from '../../types/application';
import { APPLICATION_STATUSES, STATUS_CONFIG } from '../../types/application';
import {
  IoFilterOutline,
  IoCalendarOutline,
  IoCloseOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoEyeOutline,
  IoChevronBack,
  IoChevronForward,
  IoSparkles,
  IoTrendingUpOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import ApplicationDetailModal from '../../components/Modal/ApplicationDetailModal';
import EditApplicationModal from '../../components/Modal/EditApplicationModal';
import './ApplicationsPage.css';

const ApplicationsPage: React.FC = () => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filtered, setFiltered] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [page, setPage] = useState(1);
  const [viewApp, setViewApp] = useState<Application | null>(null);
  const [editApp, setEditApp] = useState<Application | null>(null);
  const perPage = 8;

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let result = [...applications];

    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
      if (sortBy === 'oldest') return new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime();
      if (sortBy === 'company') return a.company.localeCompare(b.company);
      return 0;
    });

    setFiltered(result);
    setPage(1);
  }, [applications, statusFilter, sortBy]);

  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch {
      showToast('Failed to load applications', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application?')) return;
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
      showToast('Application deleted', 'success');
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const handleEditSave = async (id: string, data: Partial<Application>) => {
    try {
      const updated = await updateApplication(id, data);
      setApplications((prev) => prev.map((a) => (a._id === id ? updated : a)));
      setEditApp(null);
      showToast('Application updated', 'success');
    } catch {
      showToast('Failed to update', 'error');
    }
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const interviewRate = applications.length > 0
    ? Math.round((applications.filter(a => a.status === 'Interview' || a.status === 'Offer').length / applications.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className="apps-page animate-fade-in">
      {/* Header */}
      <div className="apps-header">
        <h1 className="headline-lg">Applications</h1>
        <div className="apps-filters">
          <div className="apps-filter-group">
            <IoFilterOutline size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status ▾</option>
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="apps-filter-group">
            <IoCalendarOutline size={16} />
            <span className="body-sm">Date Range ▾</span>
          </div>
          {statusFilter !== 'all' && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setStatusFilter('all')}
            >
              <IoCloseOutline size={14} />
              Clear All
            </button>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="body-sm" style={{ color: 'var(--outline)' }}>SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ minWidth: 120 }}
            >
              <option value="newest">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="apps-table card">
        <div className="apps-table-header">
          <span>JOB TITLE</span>
          <span>COMPANY</span>
          <span>STATUS</span>
          <span>APPLIED ON</span>
          <span>ACTIONS</span>
        </div>
        {paginated.length === 0 ? (
          <div className="empty-state">
            <p className="body-md" style={{ color: 'var(--outline)' }}>
              No applications found
            </p>
          </div>
        ) : (
          paginated.map((app) => (
            <div className="apps-table-row" key={app._id}>
              <div className="apps-table-job">
                <strong className="title-md">{app.role}</strong>
                <span className="body-sm" style={{ color: 'var(--outline)' }}>
                  {app.seniority && `${app.seniority} • `}{app.location || ''}
                </span>
              </div>
              <div className="apps-table-company">
                <div className="apps-company-icon">
                  {app.company?.[0]?.toUpperCase() || '?'}
                </div>
                <span>{app.company}</span>
              </div>
              <span className={`status-badge ${STATUS_CONFIG[app.status]?.cssClass || ''}`}>
                {app.status}
              </span>
              <span className="body-sm">{formatDate(app.dateApplied)}</span>
              <div className="apps-table-actions">
                <button
                  className="btn-icon-sm btn-ghost"
                  title="View"
                  onClick={() => setViewApp(app)}
                >
                  <IoEyeOutline size={16} />
                </button>
                <button
                  className="btn-icon-sm btn-ghost"
                  title="Edit"
                  onClick={() => setEditApp(app)}
                >
                  <IoCreateOutline size={16} />
                </button>
                <button
                  className="btn-icon-sm btn-ghost"
                  title="Delete"
                  onClick={() => handleDelete(app._id)}
                  style={{ color: 'var(--error)' }}
                >
                  <IoTrashOutline size={16} />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="apps-pagination">
            <span className="body-sm" style={{ color: 'var(--outline)' }}>
              Showing {(page - 1) * perPage + 1} to{' '}
              {Math.min(page * perPage, filtered.length)} of {filtered.length}{' '}
              applications
            </span>
            <div className="apps-pagination-btns">
              <button
                className="btn-icon-sm btn-secondary"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <IoChevronBack size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, page - 3), page + 2)
                .map((p) => (
                  <button
                    key={p}
                    className={`btn-icon-sm ${p === page ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setPage(p)}
                    style={{ width: 32, height: 32 }}
                  >
                    {p}
                  </button>
                ))}
              <button
                className="btn-icon-sm btn-secondary"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <IoChevronForward size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Insight Banner */}
      {applications.length > 0 && (
        <div className="apps-insight-banner">
          <div className="apps-insight-main">
            <div className="apps-insight-content">
              <h3 className="headline-md" style={{ color: '#fff' }}>
                Interview conversion is up {interviewRate}%
              </h3>
              <p className="body-md" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Your tailored resume for Design Lead roles is performing exceptionally well this month.
              </p>
              <div className="apps-insight-badge">
                <IoSparkles size={14} />
                <span>AI SUGGESTION: APPLY TO 3 MORE FINTECH ROLES</span>
              </div>
            </div>
          </div>
          <div className="apps-insight-stat card">
            <IoTimeOutline size={24} style={{ color: 'var(--primary)' }} />
            <span className="display-md" style={{ lineHeight: 1 }}>4.2</span>
            <span className="body-sm" style={{ color: 'var(--outline)' }}>Days</span>
            <span className="body-sm" style={{ color: 'var(--outline)' }}>Avg. Response Time</span>
          </div>
        </div>
      )}

      {/* Modals */}
      {viewApp && (
        <ApplicationDetailModal
          application={viewApp}
          onClose={() => setViewApp(null)}
        />
      )}
      {editApp && (
        <EditApplicationModal
          application={editApp}
          onClose={() => setEditApp(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default ApplicationsPage;
