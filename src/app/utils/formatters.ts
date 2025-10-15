// Utility functions for formatting data in the TDAH System

/**
 * Format date to Spanish locale
 */
export const formatDate = (date: Date = new Date()): string => {
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Parse time string to minutes
 */
export const parseTimeToMinutes = (timeStr: string): number => {
  const match = timeStr.match(/(\d+)\s*min/);
  return match ? parseInt(match[1]) : 0;
};

/**
 * Format minutes to readable time string
 */
export const formatMinutesToTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}min`;
};

/**
 * Validate if a log entry is complete
 */
export const validateLogEntry = (entry: {
  project: string;
  timeWorked: string;
  achievement: string;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!entry.project || entry.project.trim() === '') {
    errors.push('El proyecto es requerido');
  }
  
  if (!entry.timeWorked || entry.timeWorked.trim() === '') {
    errors.push('El tiempo trabajado es requerido');
  }
  
  if (!entry.achievement || entry.achievement.trim() === '') {
    errors.push('El logro es requerido');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get color class based on time worked
 */
export const getTimeColorClass = (timeStr: string): string => {
  const minutes = parseTimeToMinutes(timeStr);
  
  if (minutes >= 90) return 'text-green-600';
  if (minutes >= 60) return 'text-blue-600';
  if (minutes >= 30) return 'text-orange-600';
  return 'text-gray-600';
};

/**
 * Format template text with user data
 */
export const fillTemplate = (
  template: string,
  data: Record<string, string>
): string => {
  let result = template;
  
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`\\[${key}\\]`, 'g');
    result = result.replace(regex, data[key]);
  });
  
  return result;
};

