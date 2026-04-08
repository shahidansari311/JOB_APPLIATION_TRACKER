import api from '../config/api';
import type { Application, ParsedJD } from '../types/application';

// ===== Applications CRUD =====

export const getApplications = async (): Promise<Application[]> => {
  const { data } = await api.get('/applications');
  return data.data;
};

export const getApplicationById = async (id: string): Promise<Application> => {
  const { data } = await api.get(`/applications/${id}`);
  return data.data;
};

export const createApplication = async (
  appData: Partial<Application>
): Promise<Application> => {
  const { data } = await api.post('/applications', appData);
  return data.data;
};

export const updateApplication = async (
  id: string,
  appData: Partial<Application>
): Promise<Application> => {
  const { data } = await api.put(`/applications/${id}`, appData);
  return data.data;
};

export const updateApplicationStatus = async (
  id: string,
  status: string
): Promise<Application> => {
  const { data } = await api.patch(`/applications/${id}/status`, { status });
  return data.data;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await api.delete(`/applications/${id}`);
};

// ===== AI Services =====

export const parseJobDescription = async (
  jobDescription: string
): Promise<ParsedJD> => {
  const { data } = await api.post('/ai/parse-jd', { jobDescription });
  return data.data;
};

export const getResumeSuggestions = async (params: {
  role: string;
  company?: string;
  requiredSkills?: string[];
  niceToHaveSkills?: string[];
  seniority?: string;
}): Promise<string[]> => {
  const { data } = await api.post('/ai/resume-suggestions', params);
  return data.data.suggestions;
};

export const parseAndCreateApplication = async (
  jobDescription: string
): Promise<Application> => {
  const { data } = await api.post('/ai/parse-and-create', { jobDescription });
  return data.data;
};
