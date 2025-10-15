// TypeScript Type Definitions for TDAH System

export interface LogEntry {
  id?: string;
  date: string;
  project: string;
  timeWorked: string;
  achievement: string;
  evidence: string;
  createdAt?: Date;
}

export interface TemplateItem {
  category: string;
  text: string;
  icon?: string;
}

export interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
  isPositive: boolean;
}

export interface ExampleLog {
  meta: string;
  content: string;
}

export interface TimeOption {
  value: string;
  label: string;
}

export type MethodType = 'quick' | 'detailed';

export interface SystemStats {
  totalSessions: number;
  totalMinutes: number;
  totalProjects: number;
  averageSessionTime: number;
  lastSession?: LogEntry;
}

