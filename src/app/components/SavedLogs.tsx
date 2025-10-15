'use client';

import { useState } from 'react';
import { LogEntry } from '../types';
import { deleteLogEntry, exportLogsAsJSON, exportLogsAsCSV } from '../utils/storage';
import { parseTimeToMinutes } from '../utils/formatters';

interface SavedLogsProps {
  logs: LogEntry[];
  onLogsChange: () => void;
  onEdit?: (log: LogEntry) => void;
}

export default function SavedLogs({ logs, onLogsChange, onEdit }: SavedLogsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'project' | 'time'>('date');

  // Get unique projects for filter
  const projects = Array.from(new Set(logs.map(log => log.project).filter(p => p)));

  // Filter and sort logs
  const filteredLogs = logs
    .filter(log => {
      const matchesSearch = 
        log.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.achievement.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.evidence.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProject = !filterProject || log.project === filterProject;
      
      return matchesSearch && matchesProject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
        case 'project':
          return a.project.localeCompare(b.project);
        case 'time':
          return parseTimeToMinutes(b.timeWorked) - parseTimeToMinutes(a.timeWorked);
        default:
          return 0;
      }
    });

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      deleteLogEntry(id);
      onLogsChange();
    }
  };

  const handleExportJSON = () => {
    const json = exportLogsAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tdah-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csv = exportLogsAsCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tdah-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>📚</span> Registros Guardados ({filteredLogs.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            aria-label="Exportar como JSON"
          >
            📥 JSON
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            aria-label="Exportar como CSV"
          >
            📥 CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            🔍 Buscar
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en proyecto, logro o evidencia..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label htmlFor="filterProject" className="block text-sm font-medium text-gray-700 mb-2">
            📁 Filtrar por Proyecto
          </label>
          <select
            id="filterProject"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Todos los proyectos</option>
            {projects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
            📊 Ordenar por
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'project' | 'time')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="date">Fecha (más reciente)</option>
            <option value="project">Proyecto (A-Z)</option>
            <option value="time">Tiempo (mayor a menor)</option>
          </select>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {filteredLogs.map((log, index) => (
          <div
            key={log.id || index}
            className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-400 transition-all bg-gray-50 hover:bg-white hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {log.project}
                  </span>
                  <span className="text-sm text-gray-600">
                    📅 {log.date}
                  </span>
                  <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    ⏱️ {log.timeWorked}
                  </span>
                </div>
                <p className="text-gray-800 font-medium mb-2">
                  <span className="text-green-600 mr-2">✅</span>
                  {log.achievement}
                </p>
                {log.evidence && (
                  <p className="text-sm text-gray-600 bg-yellow-50 border-l-4 border-yellow-400 pl-3 py-2 rounded">
                    <span className="font-semibold">📸 Evidencia:</span> {log.evidence}
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                {onEdit && (
                  <button
                    onClick={() => onEdit(log)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    aria-label="Editar registro"
                    title="Editar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(log.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  aria-label="Eliminar registro"
                  title="Eliminar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && logs.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">No se encontraron registros con esos criterios</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterProject('');
            }}
            className="mt-4 text-blue-600 hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}

