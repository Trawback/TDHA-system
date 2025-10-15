// Local Storage Utilities for TDAH System
// This module handles persistence of log entries

import { LogEntry } from '../types';

const STORAGE_KEY = 'tdah_system_logs';

/**
 * Get all log entries from localStorage
 */
export const getLogEntries = (): LogEntry[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

/**
 * Save a new log entry to localStorage
 */
export const saveLogEntry = (entry: LogEntry): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const entries = getLogEntries();
    const newEntry: LogEntry = {
      ...entry,
      id: generateId(),
      createdAt: new Date(),
    };
    
    entries.unshift(newEntry); // Add to beginning of array
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Delete a log entry by ID
 */
export const deleteLogEntry = (id: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const entries = getLogEntries();
    const filtered = entries.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    return false;
  }
};

/**
 * Update an existing log entry
 */
export const updateLogEntry = (id: string, updates: Partial<LogEntry>): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const entries = getLogEntries();
    const index = entries.findIndex(entry => entry.id === id);
    
    if (index === -1) return false;
    
    entries[index] = { ...entries[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error('Error updating localStorage:', error);
    return false;
  }
};

/**
 * Clear all log entries
 */
export const clearAllLogs = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Export logs as JSON
 */
export const exportLogsAsJSON = (): string => {
  const entries = getLogEntries();
  return JSON.stringify(entries, null, 2);
};

/**
 * Export logs as CSV
 */
export const exportLogsAsCSV = (): string => {
  const entries = getLogEntries();
  
  if (entries.length === 0) return '';
  
  const headers = ['Fecha', 'Proyecto', 'Tiempo', 'Logro', 'Evidencia'];
  const rows = entries.map(entry => [
    entry.date,
    entry.project,
    entry.timeWorked,
    entry.achievement,
    entry.evidence,
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
  
  return csvContent;
};

/**
 * Generate a unique ID for log entries
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get statistics from all logs
 */
export const getStats = () => {
  const entries = getLogEntries();
  
  const totalMinutes = entries.reduce((sum, entry) => {
    const minutes = parseInt(entry.timeWorked) || 0;
    return sum + minutes;
  }, 0);
  
  const projects = new Set(entries.map(e => e.project)).size;
  
  return {
    totalSessions: entries.length,
    totalMinutes,
    totalProjects: projects,
    averageSessionTime: entries.length > 0 ? Math.round(totalMinutes / entries.length) : 0,
    lastSession: entries[0],
  };
};

