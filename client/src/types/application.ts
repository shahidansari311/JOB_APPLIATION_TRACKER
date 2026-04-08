export interface Application {
  _id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  jobDescriptionLink: string;
  notes: string;
  dateApplied: string;
  salaryRange: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
  resumeSuggestions: string[];
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Phone Screen'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
];

export const STATUS_CONFIG: Record<ApplicationStatus, { color: string; bg: string; cssClass: string }> = {
  Applied: { color: 'var(--status-applied)', bg: 'var(--status-applied-bg)', cssClass: 'applied' },
  'Phone Screen': { color: 'var(--status-phone-screen)', bg: 'var(--status-phone-screen-bg)', cssClass: 'phone-screen' },
  Interview: { color: 'var(--status-interview)', bg: 'var(--status-interview-bg)', cssClass: 'interview' },
  Offer: { color: 'var(--status-offer)', bg: 'var(--status-offer-bg)', cssClass: 'offer' },
  Rejected: { color: 'var(--status-rejected)', bg: 'var(--status-rejected-bg)', cssClass: 'rejected' },
};

export interface ParsedJD {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
  salaryRange: string;
}

export interface DashboardStats {
  total: number;
  applied: number;
  phoneScreen: number;
  interview: number;
  offer: number;
  rejected: number;
}
