import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import {
  createApplication,
  parseAndCreateApplication,
} from '../../services/applicationService';
import { APPLICATION_STATUSES } from '../../types/application';
import {
  IoSparkles,
  IoShieldCheckmarkOutline,
  IoAnalyticsOutline,
  IoSyncOutline,
  IoBriefcaseOutline,
} from 'react-icons/io5';
import './AddJobPage.css';

const AddJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [isLoading, setIsLoading] = useState(false);

  // Manual form
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [jobDescriptionLink, setJobDescriptionLink] = useState('');

  // AI mode
  const [jobDescription, setJobDescription] = useState('');

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createApplication({
        role,
        company,
        status: status as any,
        notes,
        salaryRange,
        jobDescriptionLink,
      });
      showToast('Application tracked successfully! 🎯', 'success');
      navigate('/applications');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create application', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      showToast('Please paste a job description', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      await parseAndCreateApplication(jobDescription);
      showToast('AI created your application! 🤖✨', 'success');
      navigate('/applications');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'AI parsing failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-job-page animate-fade-in">
      {/* Header Icon */}
      <div className="add-job-hero">
        <div className="add-job-hero-icon">
          <IoBriefcaseOutline size={28} />
        </div>
        <h1 className="headline-lg">Track a New Opportunity</h1>
        <p className="body-md" style={{ color: 'var(--outline)' }}>
          AI will help you curate your application strategy.
        </p>
      </div>

      {/* Mode Switch */}
      <div className="add-job-mode-switch">
        <button
          className={`add-job-mode-btn ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => setMode('manual')}
        >
          Manual Entry
        </button>
        <button
          className={`add-job-mode-btn ${mode === 'ai' ? 'active' : ''}`}
          onClick={() => setMode('ai')}
        >
          <IoSparkles size={14} />
          AI Auto-Fill
        </button>
      </div>

      {/* Manual Form */}
      {mode === 'manual' && (
        <form className="add-job-form card animate-fade-in-up" onSubmit={handleManualSubmit}>
          <div className="add-job-form-grid">
            <div className="input-group">
              <label>Job Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Product Designer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Company Name</label>
              <input
                type="text"
                placeholder="e.g. Linear Inc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Current Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="add-job-form-grid">
            <div className="input-group">
              <label>Salary Range (Optional)</label>
              <input
                type="text"
                placeholder="e.g. $80k - $120k"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>JD Link (Optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={jobDescriptionLink}
                onChange={(e) => setJobDescriptionLink(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Context & Notes</label>
            <textarea
              placeholder="Briefly describe the role, salary expectations, or why you're a fit..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg add-job-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <>
                Initialize AI Tracking
                <IoSparkles size={16} />
              </>
            )}
          </button>
        </form>
      )}

      {/* AI Auto-Fill */}
      {mode === 'ai' && (
        <form className="add-job-form card animate-fade-in-up" onSubmit={handleAISubmit}>
          <div className="add-job-ai-header">
            <IoSparkles size={20} style={{ color: 'var(--primary)' }} />
            <div>
              <h3 className="title-md">Paste Job Description</h3>
              <p className="body-sm" style={{ color: 'var(--outline)' }}>
                AI will automatically extract company, role, skills, and generate resume suggestions.
              </p>
            </div>
          </div>

          <div className="input-group">
            <textarea
              placeholder="Paste the full job description here... AI will parse and extract all relevant fields automatically."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              required
              className="add-job-ai-textarea"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg add-job-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                AI is analyzing...
              </>
            ) : (
              <>
                Parse & Create Application
                <IoSparkles size={16} />
              </>
            )}
          </button>
        </form>
      )}

      {/* Trust Badges */}
      <div className="add-job-badges">
        <div className="add-job-badge">
          <IoShieldCheckmarkOutline size={16} />
          <span>PRIVATE DATA</span>
        </div>
        <div className="add-job-badge">
          <IoAnalyticsOutline size={16} />
          <span>AUTO-ANALYSIS</span>
        </div>
        <div className="add-job-badge">
          <IoSyncOutline size={16} />
          <span>MULTI-DEVICE SYNC</span>
        </div>
      </div>
    </div>
  );
};

export default AddJobPage;
