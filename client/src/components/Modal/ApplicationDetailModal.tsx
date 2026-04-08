import React from 'react';
import type { Application } from '../../types/application';
import { STATUS_CONFIG } from '../../types/application';
import { IoClose, IoCopyOutline, IoLocationOutline, IoBriefcaseOutline } from 'react-icons/io5';
import { useToast } from '../../context/ToastContext';
import './Modal.css';

interface Props {
  application: Application;
  onClose: () => void;
}

const ApplicationDetailModal: React.FC<Props> = ({ application, onClose }) => {
  const { showToast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="headline-md">{application.role}</h2>
            <p className="body-md" style={{ color: 'var(--outline)', marginTop: 4 }}>
              {application.company}
            </p>
          </div>
          <button className="btn-icon btn-ghost" onClick={onClose}>
            <IoClose size={22} />
          </button>
        </div>

        <div className="modal-body">
          {/* Meta row */}
          <div className="detail-meta">
            <span className={`status-badge ${STATUS_CONFIG[application.status]?.cssClass}`}>
              {application.status}
            </span>
            {application.location && (
              <span className="detail-meta-item">
                <IoLocationOutline size={14} /> {application.location}
              </span>
            )}
            {application.seniority && (
              <span className="detail-meta-item">
                <IoBriefcaseOutline size={14} /> {application.seniority}
              </span>
            )}
          </div>

          <div className="detail-grid">
            <div className="detail-field">
              <span className="label-md">Date Applied</span>
              <span className="body-md">{formatDate(application.dateApplied)}</span>
            </div>
            {application.salaryRange && (
              <div className="detail-field">
                <span className="label-md">Salary Range</span>
                <span className="body-md">{application.salaryRange}</span>
              </div>
            )}
            {application.jobDescriptionLink && (
              <div className="detail-field">
                <span className="label-md">JD Link</span>
                <a href={application.jobDescriptionLink} target="_blank" rel="noopener" className="body-md">
                  View Job Description ↗
                </a>
              </div>
            )}
          </div>

          {application.notes && (
            <div className="detail-section">
              <span className="label-md">Notes</span>
              <p className="body-md">{application.notes}</p>
            </div>
          )}

          {application.requiredSkills.length > 0 && (
            <div className="detail-section">
              <span className="label-md">Required Skills</span>
              <div className="detail-tags">
                {application.requiredSkills.map((skill, i) => (
                  <span className="detail-tag" key={i}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {application.niceToHaveSkills.length > 0 && (
            <div className="detail-section">
              <span className="label-md">Nice to Have</span>
              <div className="detail-tags">
                {application.niceToHaveSkills.map((skill, i) => (
                  <span className="detail-tag secondary" key={i}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {application.resumeSuggestions.length > 0 && (
            <div className="detail-section">
              <span className="label-md">AI Resume Suggestions</span>
              <div className="detail-suggestions">
                {application.resumeSuggestions.map((s, i) => (
                  <div className="detail-suggestion" key={i}>
                    <p className="body-md">{s}</p>
                    <button
                      className="btn-icon-sm btn-ghost"
                      onClick={() => copyToClipboard(s)}
                      title="Copy"
                    >
                      <IoCopyOutline size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;
