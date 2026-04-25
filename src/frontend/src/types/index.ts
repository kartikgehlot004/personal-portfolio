// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminLoginForm {
  password: string;
}

export interface AdminSession {
  token: string;
  expiresAt: number; // Unix timestamp ms
}

// ─── Stat ─────────────────────────────────────────────────────────────────────

export interface StatItem {
  value: string;
  label: string;
}

// ─── Research ─────────────────────────────────────────────────────────────────

export interface ResearchProject {
  id: number;
  seqNum: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  fullContent: string;
  pdfUrl?: string;
}

export interface ResearchInput {
  seqNum: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  fullContent: string;
  pdfUrl?: string;
}

// ─── Article ──────────────────────────────────────────────────────────────────

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishDate: string;
  coverImage: string;
  pdfUrl?: string;
}

export interface ArticleInput {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishDate: string;
  coverImage: string;
  pdfUrl?: string;
}

// ─── Publication ──────────────────────────────────────────────────────────────

export interface Publication {
  id: number;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  pubType: string;
  link: string;
  pdfUrl?: string;
}

export interface PublicationInput {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  pubType: string;
  link: string;
  pdfUrl?: string;
}

// ─── Note ─────────────────────────────────────────────────────────────────────

export interface Note {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  tags: string[];
  pdfUrl?: string;
}

export interface NoteInput {
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  tags: string[];
  pdfUrl?: string;
}

// ─── Profile / Milestone ──────────────────────────────────────────────────────

export interface Milestone {
  year: number;
  title: string;
  description: string;
}

export interface MilestoneInput {
  year: number;
  title: string;
  description: string;
}

export interface ProfileInput {
  name: string;
  bio: string;
  avatarUrl: string;
  stats: { value: string; statLabel: string }[];
  skills: string[];
  milestones: MilestoneInput[];
}

export interface Profile {
  name: string;
  bio: string;
  avatarUrl: string;
  stats: StatItem[];
  skills: string[];
  milestones: Milestone[];
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactRecord {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: number; // nanoseconds timestamp from backend
}
