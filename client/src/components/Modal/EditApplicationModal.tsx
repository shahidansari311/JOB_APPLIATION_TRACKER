import React, { useState } from 'react';
import type { Application, ApplicationStatus } from '../../types/application';
import { APPLICATION_STATUSES } from '../../types/application';
import { IoClose } from 'react-icons/io5';
import './Modal.css';

interface Props {
  application: Application;
  onClose: () => void;
  onSave: (id: string, data: Partial<Application>) => void;
}

const EditApplicationModal: React.FC<Props> = ({ application, onClose, onSave }) => {
  const [form, setForm] = useState({
    company: application.company,
    role: application.role,
    status: application.status as ApplicationStatus,
    jobDescriptionLink: application.jobDescriptionLink,
    notes: application.notes,
    salaryRange: application.salaryRange,
    location: application.location,
    seniority: application.seniority,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(application._id, form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="headline-md">Edit Application</h2>
          <button className="btn-icon btn-ghost" onClick={onClose}>
            <IoClose size={22} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-form-grid">
              <div className="input-group">
                <label>Job Title</label>
                <input name="role" value={form.role} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Company</label>
                <input name="company" value={form.company} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Salary Range</label>
                <input name="salaryRange" value={form.salaryRange} onChange={handleChange} placeholder="e.g. $80k - $120k" />
              </div>
              <div className="input-group">
                <label>Location</label>
                <input name="location" value={form.location} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Seniority</label>
                <input name="seniority" value={form.seniority} onChange={handleChange} />
              </div>
            </div>
            <div className="input-group" style={{ marginTop: 'var(--space-lg)' }}>
              <label>JD Link</label>
              <input name="jobDescriptionLink" value={form.jobDescriptionLink} onChange={handleChange} type="url" placeholder="https://..." />
            </div>
            <div className="input-group" style={{ marginTop: 'var(--space-lg)' }}>
              <label>Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditApplicationModal;
