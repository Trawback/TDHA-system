'use client';

import { useState, useEffect, useCallback } from 'react';
import { LogEntry, TemplateItem, ChecklistItem } from '../types';
import { saveLogEntry, getLogEntries } from '../utils/storage';
import { formatDate } from '../utils/formatters';
import Toast, { ToastType } from './Toast';
import DashboardEnhanced from './DashboardEnhanced';
import SavedLogs from './SavedLogs';

export default function TDAHSystemEnhanced() {
  // State Management
  const [currentLog, setCurrentLog] = useState<LogEntry>({
    date: formatDate(),
    project: '',
    timeWorked: '',
    achievement: '',
    evidence: '',
  });

  const [selectedTime, setSelectedTime] = useState<string>('');
  const [savedLogs, setSavedLogs] = useState<LogEntry[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'registro' | 'dashboard' | 'historial'>('registro');
  
  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 1, text: '¿Trabajé mínimo 30 minutos concentrados?', checked: false, isPositive: true },
    { id: 2, text: '¿Hay algo tangible/visible que NO existía antes?', checked: false, isPositive: true },
    { id: 3, text: '¿Puedo mostrar evidencia específica de lo logrado?', checked: false, isPositive: true },
    { id: 4, text: '¿El proyecto está más cerca de completarse?', checked: false, isPositive: true },
    { id: 5, text: 'NO CUENTA: Solo leer, planear, organizar archivos, ver tutoriales', checked: false, isPositive: false },
    { id: 6, text: 'NO CUENTA: "Trabajé en..." sin resultado específico', checked: false, isPositive: false },
  ]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Load saved logs and dark mode preference
  useEffect(() => {
    const logs = getLogEntries();
    setSavedLogs(logs);
    
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('tdah_dark_mode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const timeOptions = ['30 min', '45 min', '60 min', '90 min', '120 min'];

  const templates: TemplateItem[] = [
    {
      category: '📱 DESARROLLO/DISEÑO:',
      text: '"Completé [X funcionalidad] → archivo [nombre.ext] guardado"'
    },
    {
      category: '📚 CONTENIDO/ESCRITURA:',
      text: '"Escribí [X palabras/páginas] de [sección] → borrador actualizado"'
    },
    {
      category: '📊 INVESTIGACIÓN/ANÁLISIS:',
      text: '"Analicé [X fuentes/datos] → documento [nombre] con [Y conclusiones]"'
    },
    {
      category: '📧 COMUNICACIÓN/GESTIÓN:',
      text: '"Envié [X emails] + programé [Y reuniones] → agenda actualizada"'
    },
    {
      category: '🎨 CREATIVO/VISUAL:',
      text: '"Diseñé [X elementos] → [Y archivos] exportados/guardados"'
    },
    {
      category: '🔧 ORGANIZACIÓN/SETUP:',
      text: '"Configuré [X herramienta/sistema] → [Y resultado] funcionando"'
    },
  ];

  const exampleLogs = [
    {
      meta: '📅 23/09/2025 - 9:15 PM → 10:00 PM (45 min)',
      content: 'App Productividad: Completé wireframes pantalla login + registro → archivo "wireframes_v2.fig" guardado en Drive'
    },
    {
      meta: '📅 24/09/2025 - 8:30 PM → 9:00 PM (30 min)',
      content: 'Curso TDAH: Grabé introducción módulo 2 → video "mod2_intro.mp4" exportado (8 minutos)'
    },
    {
      meta: '📅 25/09/2025 - 10:00 PM → 11:15 PM (75 min)',
      content: 'Reorganización: Armé escritorio nuevo + instalé lámpara → foto "setup_final.jpg" + lista materiales faltantes'
    },
  ];

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newDarkMode = !prev;
      localStorage.setItem('tdah_dark_mode', String(newDarkMode));
      
      if (newDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      
      showToast(`Modo ${newDarkMode ? 'oscuro' : 'claro'} activado`, 'info');
      return newDarkMode;
    });
  }, [showToast]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentLog({ ...currentLog, timeWorked: time });
    setFieldErrors(prev => ({ ...prev, timeWorked: '' }));
  };

  const handleInputChange = (field: keyof LogEntry, value: string) => {
    setCurrentLog({ ...currentLog, [field]: value });
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleChecklistItem = (id: number) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleTemplateClick = (template: TemplateItem) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(template.text)
        .then(() => {
          showToast('Plantilla copiada al portapapeles', 'success');
        })
        .catch(() => {
          showToast('Error al copiar plantilla', 'error');
        });
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      const printContent = document.getElementById('printable-format');
      if (!printContent) return;

      // Create a new window for printing
      const printWindow = window.open('', '', 'height=600,width=800');
      if (!printWindow) return;

      printWindow.document.write('<html><head><title>Formato de Registro Semanal - TDAH</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        body {
          font-family: 'Courier New', monospace;
          margin: 20px;
          color: #000;
          background: #fff;
        }
        .print-header {
          text-align: center;
          font-weight: bold;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
          margin-bottom: 15px;
          font-size: 16px;
        }
        .log-template {
          border: 1px solid #333;
          padding: 12px;
          margin: 10px 0;
          min-height: 80px;
          page-break-inside: avoid;
        }
        .template-fields {
          font-size: 12px;
          color: #333;
          line-height: 1.8;
        }
        @media print {
          body { margin: 0; }
          @page { margin: 1cm; }
        }
      `);
      printWindow.document.write('</style></head><body>');
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);

      showToast('Formato preparado para impresión', 'success');
    }
  };

  const handleSaveLog = useCallback(() => {
    // Validate the log entry
    const errors: Record<string, string> = {};
    
    if (!currentLog.project.trim()) {
      errors.project = 'El proyecto es requerido';
    }
    
    if (!currentLog.timeWorked.trim()) {
      errors.timeWorked = 'El tiempo trabajado es requerido';
    }
    
    if (!currentLog.achievement.trim()) {
      errors.achievement = 'El logro es requerido';
    }
    
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      showToast('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    const saved = saveLogEntry(currentLog);
    
    if (saved) {
      showToast('¡Registro guardado exitosamente! 🎉', 'success');
      
      const logs = getLogEntries();
      setSavedLogs(logs);
      
      // Reset form
      setCurrentLog({
        date: formatDate(),
        project: '',
        timeWorked: '',
        achievement: '',
        evidence: '',
      });
      setSelectedTime('');
      setChecklist(prev => prev.map(item => ({ ...item, checked: false })));
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('Error al guardar el registro', 'error');
    }
  }, [currentLog, showToast]);

  const handleLogsChange = () => {
    const logs = getLogEntries();
    setSavedLogs(logs);
  };

  const handleEditLog = (log: LogEntry) => {
    setCurrentLog({
      date: log.date,
      project: log.project,
      timeWorked: log.timeWorked,
      achievement: log.achievement,
      evidence: log.evidence,
    });
    setSelectedTime(log.timeWorked);
    setActiveTab('registro');
    showToast('Registro cargado para editar', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcuts - Must be after function declarations
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default browser actions for our shortcuts
      const isOurShortcut = (e.ctrlKey || e.metaKey) && ['s', 'k', 'd'].includes(e.key.toLowerCase());
      
      if (isOurShortcut) {
        e.preventDefault();
      }

      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        handleSaveLog();
      }
      
      // Ctrl/Cmd + K for quick time selection
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        const timeButton = document.getElementById('time-30');
        if (timeButton) {
          timeButton.focus();
        }
      }
      
      // Ctrl/Cmd + D for dark mode toggle
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        toggleDarkMode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleSaveLog, toggleDarkMode]); // Properly memoized dependencies

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark-mode:bg-slate-900 dark-mode:text-slate-100">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Saltar al contenido principal
      </a>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Header with Dark Mode Toggle */}
      <div className="bg-gradient-to-r from-red-500 to-red-400 text-white p-6 text-center print:hidden shadow-lg">
        <div className="max-w-6xl mx-auto relative">
          <button
            onClick={toggleDarkMode}
            className="absolute right-0 top-0 p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            title={darkMode ? 'Modo claro (Ctrl+D)' : 'Modo oscuro (Ctrl+D)'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 animate-fade-in">
            🎯 SISTEMA DE DOCUMENTACIÓN: 30 MINUTOS DE PROGRESO REAL
          </h2>
          <p className="text-lg animate-fade-in">
            <strong>Objetivo:</strong> Registrar evidencia clara de trabajo real que &quot;salve&quot; tu proyecto de la eliminación
          </p>
          <div className="mt-4 text-sm opacity-90"> 
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md print:hidden sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <nav className="flex" role="tablist" aria-label="Navegación principal">
            <button
              role="tab"
              aria-selected={activeTab === 'registro'}
              aria-controls="registro-panel"
              onClick={() => setActiveTab('registro')}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === 'registro'
                  ? 'bg-red-500 text-white border-b-4 border-red-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📝 Nuevo Registro
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'dashboard'}
              aria-controls="dashboard-panel"
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-red-500 text-white border-b-4 border-red-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'historial'}
              aria-controls="historial-panel"
              onClick={() => setActiveTab('historial')}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === 'historial'
                  ? 'bg-red-500 text-white border-b-4 border-red-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📚 Historial ({savedLogs.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main id="main-content" className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div role="tabpanel" id="dashboard-panel" aria-labelledby="dashboard-tab" className="animate-fade-in">
            <DashboardEnhanced logs={savedLogs} />
          </div>
        )}

        {/* Historial Tab */}
        {activeTab === 'historial' && (
          <div role="tabpanel" id="historial-panel" aria-labelledby="historial-tab" className="animate-fade-in">
            <SavedLogs 
              logs={savedLogs} 
              onLogsChange={handleLogsChange}
              onEdit={handleEditLog}
            />
          </div>
        )}

        {/* Registro Tab */}
        {activeTab === 'registro' && (
          <div role="tabpanel" id="registro-panel" aria-labelledby="registro-tab" className="animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              {/* Header */}
              <div className="text-center border-b-4 border-red-500 pb-4 mb-8">
                <h1 className="text-3xl font-bold text-red-500 mb-2">📊 REGISTRO DE PROGRESO REAL</h1>
                <p className="text-gray-600 text-sm">
                  Documenta para SOBREVIVIR • Evidencia para CONTINUAR
                </p>
              </div>

              {/* Method Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border-2 border-red-500 bg-gradient-to-br from-red-500 to-red-400 text-white rounded-xl p-6 animate-slide-in-left">
                  <h3 className="text-xl font-bold text-center mb-4">⚡ MÉTODO RÁPIDO</h3>
                  <p className="font-semibold mb-3">Para cuando trabajas:</p>
                  <ul className="space-y-2 mb-4">
                    <li>⏱️ Cronómetro visible durante trabajo</li>
                    <li>📝 Registro inmediato al terminar</li>
                    <li>🎯 1 línea de qué lograste</li>
                    <li>✅ Marcar en tablero físico</li>
                  </ul>
                  <div className="bg-white/20 rounded-lg p-3">
                    <strong>Tiempo mínimo:</strong> 30 segundos documentar
                  </div>
                </div>

                <div className="border-2 border-gray-300 bg-gray-50 rounded-xl p-6 animate-slide-in-right">
                  <h3 className="text-xl font-bold text-center mb-4 text-gray-800">📋 MÉTODO DETALLADO</h3>
                  <p className="font-semibold mb-3 text-gray-800">Para proyectos complejos:</p>
                  <ul className="space-y-2 mb-4 text-gray-700">
                    <li>📊 Log completo de actividades</li>
                    <li>📝 Detalles de lo realizado</li>
                    <li>🚧 Obstáculos encontrados</li>
                    <li>➡️ Próximos pasos definidos</li>
                  </ul>
                  <div className="bg-gray-200 rounded-lg p-3 text-gray-800">
                    <strong>Tiempo mínimo:</strong> 2-3 minutos documentar
                  </div>
                </div>
              </div>

              {/* Quick Log Form */}
              <div className="bg-white border-2 border-red-500 rounded-xl mb-8">
                <div className="bg-red-500 text-white font-bold p-4 rounded-t-lg">
                  ⚡ REGISTRO RÁPIDO (Recomendado para TDAH)
                </div>
                <form 
                  className="p-6 space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveLog();
                  }}
                >
                  {/* Date Field */}
                  <div>
                    <label htmlFor="date-input" className="block font-bold mb-2 text-gray-800">
                      📅 Fecha y Hora:
                    </label>
                    <input
                      id="date-input"
                      type="text"
                      value={currentLog.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all"
                      placeholder="Ej: 23/09/2025 - 9:30 PM"
                      aria-describedby="date-help"
                    />
                    <small id="date-help" className="text-gray-500 text-sm mt-1 block">
                      Se actualiza automáticamente
                    </small>
                  </div>

                  {/* Project Field */}
                  <div>
                    <label htmlFor="project-input" className="block font-bold mb-2 text-gray-800">
                      🎯 Proyecto: <span className="text-red-500" aria-label="requerido">*</span>
                    </label>
                    <input
                      id="project-input"
                      type="text"
                      value={currentLog.project}
                      onChange={(e) => handleInputChange('project', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.project
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                      }`}
                      placeholder="Nombre del proyecto activo"
                      aria-required="true"
                      aria-invalid={!!fieldErrors.project}
                      aria-describedby={fieldErrors.project ? 'project-error' : undefined}
                    />
                    {fieldErrors.project && (
                      <p id="project-error" className="text-red-500 text-sm mt-1" role="alert">
                        {fieldErrors.project}
                      </p>
                    )}
                  </div>

                  {/* Time Worked Field */}
                  <div>
                    <label htmlFor="time-input" className="block font-bold mb-2 text-gray-800">
                      ⏱️ Tiempo trabajado: <span className="text-red-500" aria-label="requerido">*</span>
                    </label>
                    <input
                      id="time-input"
                      type="text"
                      value={currentLog.timeWorked}
                      onChange={(e) => handleInputChange('timeWorked', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all mb-3 ${
                        fieldErrors.timeWorked
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                      }`}
                      placeholder="Minutos exactos"
                      aria-required="true"
                      aria-invalid={!!fieldErrors.timeWorked}
                      aria-describedby={fieldErrors.timeWorked ? 'time-error' : 'time-help'}
                    />
                    {fieldErrors.timeWorked && (
                      <p id="time-error" className="text-red-500 text-sm mt-1 mb-2" role="alert">
                        {fieldErrors.timeWorked}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Selección rápida de tiempo">
                      {timeOptions.map((time, index) => (
                        <button
                          key={time}
                          id={index === 0 ? 'time-30' : undefined}
                          type="button"
                          onClick={() => handleTimeSelect(time)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                            selectedTime === time
                              ? 'bg-red-500 text-white shadow-lg'
                              : 'bg-white text-red-500 border border-red-500 hover:bg-red-500 hover:text-white'
                          }`}
                          aria-pressed={selectedTime === time}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    <small id="time-help" className="text-gray-500 text-sm mt-2 block">
                      Presiona Ctrl+K para acceso rápido
                    </small>
                  </div>

                  {/* Achievement Field */}
                  <div>
                    <label htmlFor="achievement-input" className="block font-bold mb-2 text-gray-800">
                      ✅ QUÉ LOGRÉ (1 línea específica): <span className="text-red-500" aria-label="requerido">*</span>
                    </label>
                    <input
                      id="achievement-input"
                      type="text"
                      value={currentLog.achievement}
                      onChange={(e) => handleInputChange('achievement', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.achievement
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                      }`}
                      placeholder="Ej: Terminé wireframes pantalla login + registro"
                      aria-required="true"
                      aria-invalid={!!fieldErrors.achievement}
                      aria-describedby={fieldErrors.achievement ? 'achievement-error' : undefined}
                    />
                    {fieldErrors.achievement && (
                      <p id="achievement-error" className="text-red-500 text-sm mt-1" role="alert">
                        {fieldErrors.achievement}
                      </p>
                    )}
                  </div>

                  {/* Evidence Field */}
                  <div>
                    <label htmlFor="evidence-input" className="block font-bold mb-2 text-gray-800">
                      📸 EVIDENCIA (opcional pero potente):
                    </label>
                    <input
                      id="evidence-input"
                      type="text"
                      value={currentLog.evidence}
                      onChange={(e) => handleInputChange('evidence', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all"
                      placeholder="Ej: Screenshot, archivo guardado, email enviado, etc."
                    />
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-500 to-red-400 text-white font-bold py-4 px-6 rounded-lg hover:from-red-600 hover:to-red-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                      aria-label="Guardar registro (Ctrl+S)"
                    >
                      💾 Guardar Registro
                      <span className="text-sm ml-2 opacity-80">(Ctrl+S)</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Rest of the content continues... */}
              {/* Templates Section */}
              <div className="bg-gray-50 border-2 border-orange-400 rounded-xl mb-8">
                <div className="bg-orange-400 text-white font-bold p-4 rounded-t-lg">
                  📝 PLANTILLAS DE LOGROS (Click para copiar)
                </div>
                <div className="p-6 space-y-3">
                  {templates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => handleTemplateClick(template)}
                      className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all transform hover:scale-[1.02]"
                      aria-label={`Copiar plantilla: ${template.category}`}
                    >
                      <div className="text-orange-500 font-bold text-sm mb-1">
                        {template.category}
                      </div>
                      <div className="text-gray-800 text-sm">
                        {template.text}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Validation Checklist */}
              <div className="bg-green-50 border-2 border-green-400 rounded-xl mb-8">
                <div className="bg-green-400 text-white font-bold p-4 rounded-t-lg">
                  ✅ CHECKLIST: ¿ES PROGRESO REAL?
                </div>
                <div className="p-6">
                  <ul className="space-y-3" role="list">
                    {checklist.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => toggleChecklistItem(item.id)}
                          className="w-full flex items-center bg-white rounded-lg p-3 cursor-pointer hover:shadow-md transition-all text-left"
                          role="checkbox"
                          aria-checked={item.checked}
                          aria-label={item.text}
                        >
                          <div
                            className={`w-6 h-6 border-2 rounded flex items-center justify-center mr-3 flex-shrink-0 transition-all ${
                              item.isPositive
                                ? 'border-green-400'
                                : 'border-red-400'
                            } ${
                              item.checked
                                ? item.isPositive
                                  ? 'bg-green-400 text-white'
                                  : 'bg-red-400 text-white'
                                : 'bg-white'
                            }`}
                            aria-hidden="true"
                          >
                            {item.checked && (item.isPositive ? '✓' : '✗')}
                          </div>
                          <span className="text-gray-800">{item.text}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Example Logs */}
              <div className="bg-blue-50 border-2 border-dashed border-blue-400 rounded-xl p-6 mb-8">
                <div className="font-bold text-blue-600 text-lg mb-4">
                  📚 EJEMPLOS DE REGISTROS VÁLIDOS:
                </div>
                <div className="space-y-4">
                  {exampleLogs.map((log, index) => (
                    <div
                      key={index}
                      className="bg-white border-l-4 border-blue-400 rounded-r-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="text-gray-600 text-sm mb-2">{log.meta}</div>
                      <div className="text-gray-800">
                        <strong>{log.content.split(':')[0]}:</strong>
                        {log.content.substring(log.content.indexOf(':') + 1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Print Format */}
              <div className="bg-white border-2 border-gray-800 rounded-lg p-6">
                <div id="printable-format" className="font-mono">
                  <div className="print-header text-center font-bold border-b-2 border-gray-800 pb-3 mb-6">
                    📋 FORMATO IMPRIMIBLE - REGISTRO SEMANAL
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <div key={num} className="log-template border border-gray-800 rounded p-4 min-h-[100px] bg-gray-50">
                        <div className="template-fields text-sm text-gray-700 space-y-1">
                          <div><strong>SESIÓN {num}</strong></div>
                          <div>FECHA: ___/___/___ | HORA: _____ → _____ | TIEMPO: _____ min</div>
                          <div>PROYECTO: _________________________________________________</div>
                          <div>LOGRO: ___________________________________________________</div>
                          <div>EVIDENCIA: ____________________________________________</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center text-sm text-gray-600 border-t-2 border-gray-800 pt-4">
                    <p><strong>Sistema de Documentación TDAH</strong> - Progreso Real en 30 Minutos</p>
                    <p className="text-xs mt-2">Documenta para SOBREVIVIR • Evidencia para CONTINUAR</p>
                  </div>
                </div>
                <div className="mt-6 text-center print:hidden">
                  <button
                    onClick={handlePrint}
                    className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors transform hover:scale-105 shadow-lg hover:shadow-xl"
                    aria-label="Imprimir formato semanal"
                    title="Imprime solo el formato, no toda la página"
                  >
                    🖨️ Imprimir Formato Semanal
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Se abrirá una ventana nueva con solo el formato para imprimir</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12 print:hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="mb-2">
            Sistema de Documentación TDAH - v1.0.0
          </p>
          <p className="text-sm text-gray-400">
            Desarrollado con ❤️ para la comunidad TDAH
          </p>
        </div>
      </footer>
    </div>
  );
}

