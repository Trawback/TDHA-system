'use client';

import { useMemo, useState, useEffect } from 'react';
import { LogEntry } from '../types';
import { formatMinutesToTime, parseTimeToMinutes } from '../utils/formatters';

interface DashboardEnhancedProps {
  logs: LogEntry[];
}

interface Project {
  id: string;
  name: string;
  daysLeft: number;
  lastProgress: string;
  lastProgressDate: Date;
}

interface DeadProject {
  name: string;
  diedOnDay: number;
}

interface Idea {
  id: string;
  text: string;
}

export default function DashboardEnhanced({ logs }: DashboardEnhancedProps) {
  // State for projects
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [deadProjects, setDeadProjects] = useState<DeadProject[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [powerZoneStart, setPowerZoneStart] = useState('20:00');
  const [powerZoneEnd, setPowerZoneEnd] = useState('00:00');
  const [newIdeaText, setNewIdeaText] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('tdah_active_projects');
    const savedDeadProjects = localStorage.getItem('tdah_dead_projects');
    const savedIdeas = localStorage.getItem('tdah_ideas');
    const savedPowerZone = localStorage.getItem('tdah_power_zone');

    if (savedProjects) {
      const projects = JSON.parse(savedProjects) as Project[];
      setActiveProjects(projects.map((p) => ({
        ...p,
        lastProgressDate: new Date(p.lastProgressDate)
      })));
    }
    if (savedDeadProjects) setDeadProjects(JSON.parse(savedDeadProjects));
    if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
    if (savedPowerZone) {
      const zone = JSON.parse(savedPowerZone);
      setPowerZoneStart(zone.start);
      setPowerZoneEnd(zone.end);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('tdah_active_projects', JSON.stringify(activeProjects));
  }, [activeProjects]);

  useEffect(() => {
    localStorage.setItem('tdah_dead_projects', JSON.stringify(deadProjects));
  }, [deadProjects]);

  useEffect(() => {
    localStorage.setItem('tdah_ideas', JSON.stringify(ideas));
  }, [ideas]);

  // Update project deadlines based on logs
  useEffect(() => {
    if (activeProjects.length === 0 || logs.length === 0) return;

    const updatedProjects = activeProjects.map(project => {
      // Find the most recent log for this project
      const projectLogs = logs.filter(log => 
        log.project.toLowerCase().includes(project.name.toLowerCase()) ||
        project.name.toLowerCase().includes(log.project.toLowerCase())
      );

      if (projectLogs.length > 0) {
        const mostRecent = projectLogs[0]; // logs are already sorted by date
        const lastDate = new Date(mostRecent.createdAt || mostRecent.date);
        const daysSince = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysLeft = 7 - daysSince;

        return {
          ...project,
          daysLeft: Math.max(0, daysLeft),
          lastProgress: mostRecent.achievement,
          lastProgressDate: lastDate
        };
      }

      return project;
    });

    // Check for dead projects (0 days left)
    const newDeadProjects: DeadProject[] = [];
    const survivingProjects = updatedProjects.filter(project => {
      if (project.daysLeft === 0) {
        newDeadProjects.push({
          name: project.name,
          diedOnDay: 8
        });
        return false;
      }
      return true;
    });

    if (newDeadProjects.length > 0) {
      setDeadProjects(prev => [...newDeadProjects, ...prev]);
      setActiveProjects(survivingProjects);
    } else {
      setActiveProjects(updatedProjects);
    }
  }, [logs]); // eslint-disable-line react-hooks/exhaustive-deps

  // Statistics
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

  const addProject = () => {
    if (activeProjects.length >= 3) {
      alert('¡MÁXIMO 3 PROYECTOS! Elimina uno antes de agregar otro.');
      return;
    }

    const name = prompt('Nombre del nuevo proyecto:');
    if (!name) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name,
      daysLeft: 7,
      lastProgress: 'Proyecto recién creado',
      lastProgressDate: new Date()
    };

    setActiveProjects([...activeProjects, newProject]);
  };

  const deleteProject = (id: string) => {
    if (confirm('¿Seguro que quieres eliminar este proyecto? Se moverá al cementerio.')) {
      const project = activeProjects.find(p => p.id === id);
      if (project) {
        setDeadProjects(prev => [...prev, { name: project.name, diedOnDay: 7 - project.daysLeft }]);
        setActiveProjects(activeProjects.filter(p => p.id !== id));
      }
    }
  };

  const activateCodeRed = () => {
    alert('🚨 CÓDIGO ROJO ACTIVADO\n\nPasos siguientes:\n1. Identifica el problema exacto\n2. Email a 7 personas que puedan ayudar\n3. Espera 24h para respuestas\n4. Aplica la primera solución viable\n\n¡NO ABANDONES EL PROYECTO!');
  };

  const addIdea = () => {
    if (newIdeaText.trim()) {
      const newIdea: Idea = {
        id: Date.now().toString(),
        text: newIdeaText.trim()
      };
      setIdeas([...ideas, newIdea]);
      setNewIdeaText('');
    }
  };

  const promoteIdea = (id: string) => {
    if (activeProjects.length >= 3) {
      alert('¡MÁXIMO 3 PROYECTOS! Libera espacio primero.');
      return;
    }

    const idea = ideas.find(i => i.id === id);
    if (idea) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: idea.text,
        daysLeft: 7,
        lastProgress: 'Promovido desde banco de ideas',
        lastProgressDate: new Date()
      };
      setActiveProjects([...activeProjects, newProject]);
      setIdeas(ideas.filter(i => i.id !== id));
    }
  };

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-black text-red-500 mb-2 drop-shadow-lg">
          🔥 SISTEMA SIN PERDÓN 🔥
        </h1>
        <p className="text-orange-400 text-xl font-bold">
          Máximo 3 proyectos • 7 días límite • Progreso real o muerte
        </p>
      </div>

      {/* Main Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects - Takes 2 columns */}
        <div className="lg:col-span-2 bg-red-500/10 border-4 border-red-500 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-red-500">
              PROYECTOS ACTIVOS ({activeProjects.length}/3)
            </h2>
            {activeProjects.length < 3 && (
              <button
                onClick={addProject}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-all transform hover:scale-105"
              >
                + AGREGAR
              </button>
            )}
          </div>

          <div className="space-y-4 min-h-[300px]">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="bg-gradient-to-r from-red-500 to-red-400 border-2 border-red-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <strong className="text-lg block mb-2">{project.name}</strong>
                    <div className={`text-3xl font-black mb-2 ${project.daysLeft <= 2 ? 'animate-pulse' : ''}`}>
                      ⏰ {project.daysLeft} {project.daysLeft === 1 ? 'DÍA' : 'DÍAS'}
                    </div>
                    <div className="bg-white/20 rounded-full px-4 py-2 text-sm">
                      Último avance: {project.lastProgress}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                    title="Mover al cementerio"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}

            {/* Empty Slots */}
            {[...Array(3 - activeProjects.length)].map((_, i) => (
              <div
                key={`empty-${i}`}
                className="border-2 border-dashed border-gray-600 rounded-xl p-5 min-h-[120px] flex items-center justify-center text-gray-500 cursor-pointer hover:border-red-500 hover:bg-red-500/5 transition-all"
                onClick={addProject}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">+</div>
                  <div>Slot disponible</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* War Room */}
          <div className="bg-orange-500/10 border-2 border-orange-500 rounded-xl p-4">
            <h3 className="text-xl font-black text-orange-500 mb-3 text-center">
              🚨 CUARTO DE GUERRA
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              ¿Proyecto bloqueado? ¡No lo abandones!
            </p>
            <button
              onClick={activateCodeRed}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 px-4 rounded-full hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
            >
              ACTIVAR CÓDIGO ROJO
            </button>
            <div className="text-xs text-orange-400 mt-3 space-y-1">
              <div>🔧 Email a 7 rescatistas</div>
              <div>⏱️ 24h para respuestas</div>
              <div>🎯 Aplica primera idea viable</div>
            </div>
          </div>

          {/* Cemetery */}
          <div className="bg-gray-800/50 border-2 border-gray-600 rounded-xl p-4">
            <h3 className="text-xl font-black text-gray-500 mb-3 text-center">
              💀 CEMENTERIO
            </h3>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {deadProjects.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-4">
                  Ningún proyecto muerto aún
                </p>
              ) : (
                deadProjects.map((project, i) => (
                  <div key={i} className="bg-gray-900/50 px-3 py-2 rounded text-gray-500 text-sm">
                    ❌ {project.name} (Día {project.diedOnDay})
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              {deadProjects.length} proyecto{deadProjects.length !== 1 ? 's' : ''} muerto{deadProjects.length !== 1 ? 's' : ''} este mes
            </p>
          </div>

          {/* Idea Bank */}
          <div className="bg-blue-500/10 border-2 border-blue-500 rounded-xl p-4">
            <h3 className="text-xl font-black text-blue-500 mb-3 text-center">
              💡 BANCO DE IDEAS
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto mb-3">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-blue-900/20 px-3 py-2 rounded text-gray-300 text-sm flex items-center justify-between hover:bg-blue-900/30 transition-colors group"
                >
                  <span className="flex-1">{idea.text}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => promoteIdea(idea.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                      title="Promover a proyecto activo"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => deleteIdea(idea.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                      title="Eliminar idea"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newIdeaText}
                onChange={(e) => setNewIdeaText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addIdea()}
                placeholder="Nueva idea..."
                className="flex-1 bg-gray-900 border border-blue-500 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addIdea}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Power Zone */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-center text-white shadow-lg">
        <h3 className="text-2xl font-black mb-3">⚡ TU ZONA DE PODER ⚡</h3>
        <div className="flex items-center justify-center gap-4 mb-3">
          <input
            type="time"
            value={powerZoneStart}
            onChange={(e) => {
              setPowerZoneStart(e.target.value);
              localStorage.setItem('tdah_power_zone', JSON.stringify({ start: e.target.value, end: powerZoneEnd }));
            }}
            className="bg-white/20 border-2 border-white/50 rounded px-3 py-2 text-2xl font-bold text-white"
          />
          <span className="text-2xl">-</span>
          <input
            type="time"
            value={powerZoneEnd}
            onChange={(e) => {
              setPowerZoneEnd(e.target.value);
              localStorage.setItem('tdah_power_zone', JSON.stringify({ start: powerZoneStart, end: e.target.value }));
            }}
            className="bg-white/20 border-2 border-white/50 rounded px-3 py-2 text-2xl font-bold text-white"
          />
        </div>
        <p className="text-sm opacity-90">Alerta automática 15 min antes</p>
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Estadísticas de Progreso</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalSessions}</div>
            <div className="text-sm text-gray-600">Sesiones Totales</div>
          </div>
          <div className="bg-purple-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{formatMinutesToTime(stats.totalMinutes)}</div>
            <div className="text-sm text-gray-600">Tiempo Total</div>
          </div>
          <div className="bg-green-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.totalProjects}</div>
            <div className="text-sm text-gray-600">Proyectos Únicos</div>
          </div>
          <div className="bg-orange-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{formatMinutesToTime(stats.averageTime)}</div>
            <div className="text-sm text-gray-600">Promedio/Sesión</div>
          </div>
          <div className="bg-pink-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-pink-600">{stats.evidenceRate}%</div>
            <div className="text-sm text-gray-600">Con Evidencia</div>
          </div>
          <div className="bg-red-100 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{stats.last7Days}</div>
            <div className="text-sm text-gray-600">Últimos 7 Días</div>
          </div>
        </div>
      </div>

      {/* Rules Panel */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h3 className="text-2xl font-black text-red-500 mb-4 text-center">
          📋 REGLAS INQUEBRANTABLES
        </h3>
        <div className="space-y-3">
          <div className="bg-gray-800 p-3 rounded border-l-4 border-red-500">
            🔥 <strong className="text-red-400">7 días sin progreso real = ELIMINACIÓN AUTOMÁTICA</strong>
          </div>
          <div className="bg-gray-800 p-3 rounded border-l-4 border-orange-500">
            ✅ <strong className="text-orange-400">Progreso real:</strong> 30 min documentados O 1 tarea completada
          </div>
          <div className="bg-gray-800 p-3 rounded border-l-4 border-yellow-500">
            🚫 <strong className="text-yellow-400">Solo 3 proyectos activos máximo</strong> - No excepciones
          </div>
          <div className="bg-gray-800 p-3 rounded border-l-4 border-orange-500">
            🚨 <strong className="text-orange-400">Código Rojo:</strong> 48h para activar si estás bloqueado
          </div>
          <div className="bg-gray-800 p-3 rounded border-l-4 border-blue-500">
            💡 <strong className="text-blue-400">Nuevas ideas van al banco</strong> - NO interrumpen proyectos activos
          </div>
          <div className="bg-gray-800 p-3 rounded border-l-4 border-gray-500">
            ⚰️ <strong className="text-gray-400">Proyecto muerto = empezar desde CERO</strong> - Sin recuperación
          </div>
        </div>
      </div>
    </div>
  );
}

