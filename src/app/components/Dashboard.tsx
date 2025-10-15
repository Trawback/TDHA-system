'use client';

import { useMemo } from 'react';
import { LogEntry } from '../types';
import { formatMinutesToTime, parseTimeToMinutes } from '../utils/formatters';

interface DashboardProps {
  logs: LogEntry[];
}

export default function Dashboard({ logs }: DashboardProps) {
  const stats = useMemo(() => {
    const totalSessions = logs.length;
    
    const totalMinutes = logs.reduce((sum, log) => {
      return sum + parseTimeToMinutes(log.timeWorked);
    }, 0);

    const projects = new Set(logs.map(log => log.project.trim()).filter(p => p));
    const totalProjects = projects.size;

    const averageTime = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

    const withEvidence = logs.filter(log => log.evidence && log.evidence.trim()).length;
    const evidenceRate = totalSessions > 0 ? Math.round((withEvidence / totalSessions) * 100) : 0;

    // Last 7 days activity
    const last7Days = logs.filter(log => {
      const logDate = new Date(log.createdAt || log.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo;
    }).length;

    return {
      totalSessions,
      totalMinutes,
      totalProjects,
      averageTime,
      evidenceRate,
      last7Days,
    };
  }, [logs]);

  const StatCard = ({ 
    icon, 
    label, 
    value, 
    subValue, 
    color 
  }: { 
    icon: string; 
    label: string; 
    value: string | number; 
    subValue?: string; 
    color: string;
  }) => (
    <div className={`${color} rounded-xl p-6 text-white shadow-lg transform transition-all hover:scale-105`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-4xl" aria-hidden="true">{icon}</span>
        <div className="text-right">
          <div className="text-3xl font-bold">{value}</div>
          {subValue && <div className="text-sm opacity-90">{subValue}</div>}
        </div>
      </div>
      <div className="text-sm font-medium opacity-90 mt-2">{label}</div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>📊</span> Tu Progreso
        </h2>
        {logs.length > 0 && (
          <span className="text-sm text-gray-600">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </span>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-lg font-medium">Aún no tienes registros</p>
          <p className="text-sm mt-2">¡Comienza a documentar tu progreso hoy!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon="🎯"
              label="Sesiones Totales"
              value={stats.totalSessions}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              icon="⏱️"
              label="Tiempo Total"
              value={formatMinutesToTime(stats.totalMinutes)}
              subValue={`${stats.totalMinutes} minutos`}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              icon="📁"
              label="Proyectos Activos"
              value={stats.totalProjects}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <StatCard
              icon="📊"
              label="Promedio por Sesión"
              value={formatMinutesToTime(stats.averageTime)}
              color="bg-gradient-to-br from-orange-500 to-orange-600"
            />
            <StatCard
              icon="📸"
              label="Con Evidencia"
              value={`${stats.evidenceRate}%`}
              subValue={`${stats.totalSessions - (stats.totalSessions * stats.evidenceRate / 100)} sin evidencia`}
              color="bg-gradient-to-br from-pink-500 to-pink-600"
            />
            <StatCard
              icon="🔥"
              label="Últimos 7 Días"
              value={stats.last7Days}
              subValue="sesiones"
              color="bg-gradient-to-br from-red-500 to-red-600"
            />
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-700">Meta Semanal: 7 sesiones</span>
              <span className="text-sm text-gray-600">{stats.last7Days} / 7</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.last7Days / 7) * 100, 100)}%` }}
                role="progressbar"
                aria-valuenow={stats.last7Days}
                aria-valuemin={0}
                aria-valuemax={7}
                aria-label="Progreso semanal"
              />
            </div>
            {stats.last7Days >= 7 && (
              <p className="text-green-600 font-medium mt-2 text-center">
                🎉 ¡Meta semanal alcanzada! ¡Excelente trabajo!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

