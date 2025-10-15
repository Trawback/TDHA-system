'use client';

import { useState, useEffect } from 'react';
import { LogEntry, TemplateItem, ChecklistItem } from '../types';
import { saveLogEntry } from '../utils/storage';
import { formatDate } from '../utils/formatters';

export default function TDAHSystem() {
  // State Management
  const [currentLog, setCurrentLog] = useState<LogEntry>({
    date: formatDate(),
    project: '',
    timeWorked: '',
    achievement: '',
    evidence: '',
  });

  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 1, text: '¿Trabajé mínimo 30 minutos concentrados?', checked: false, isPositive: true },
    { id: 2, text: '¿Hay algo tangible/visible que NO existía antes?', checked: false, isPositive: true },
    { id: 3, text: '¿Puedo mostrar evidencia específica de lo logrado?', checked: false, isPositive: true },
    { id: 4, text: '¿El proyecto está más cerca de completarse?', checked: false, isPositive: true },
    { id: 5, text: 'NO CUENTA: Solo leer, planear, organizar archivos, ver tutoriales', checked: false, isPositive: false },
    { id: 6, text: 'NO CUENTA: "Trabajé en..." sin resultado específico', checked: false, isPositive: false },
  ]);

  // Component mount effect
  useEffect(() => {
    // Load initial data if needed
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

  // Event Handlers
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentLog({ ...currentLog, timeWorked: time });
  };

  const handleInputChange = (field: keyof LogEntry, value: string) => {
    setCurrentLog({ ...currentLog, [field]: value });
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
          // Template copied successfully
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 2000);
        })
        .catch(err => console.error('Error copying template:', err));
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      const printContent = document.getElementById('printable-format-original');
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
    }
  };

  const handleSaveLog = () => {
    // Validate the log entry
    if (!currentLog.project.trim() || !currentLog.timeWorked.trim() || !currentLog.achievement.trim()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Save to localStorage
    const saved = saveLogEntry(currentLog);
    
    if (saved) {
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      // Reset form
      setCurrentLog({
        date: formatDate(),
        project: '',
        timeWorked: '',
        achievement: '',
        evidence: '',
      });
      setSelectedTime('');
      
      // Reset checklist
      setChecklist(checklist.map(item => ({ ...item, checked: false })));
    } else {
      alert('Error al guardar el registro. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          ✅ ¡Guardado exitosamente!
        </div>
      )}

      {/* Instructions Banner */}
      <div className="bg-gradient-to-r from-red-500 to-red-400 text-white p-6 text-center print:hidden">
        <h2 className="text-2xl font-bold mb-2">🎯 SISTEMA DE DOCUMENTACIÓN: 30 MINUTOS DE PROGRESO REAL</h2>
        <p className="text-lg">
          <strong>Objetivo:</strong> Registrar evidencia clara de trabajo real que &quot;salve&quot; tu proyecto de la eliminación
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center border-b-4 border-red-500 pb-4 mb-8">
            <h1 className="text-3xl font-bold text-red-500 mb-2">📊 REGISTRO DE PROGRESO REAL</h1>
            <p className="text-gray-600 text-sm">
              Documenta para SOBREVIVIR • Evidencia para CONTINUAR
            </p>
          </div>

          {/* Method Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Quick Method */}
            <div className="border-2 border-red-500 bg-gradient-to-br from-red-500 to-red-400 text-white rounded-xl p-6">
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

            {/* Detailed Method */}
            <div className="border-2 border-gray-300 bg-gray-50 rounded-xl p-6">
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
            <div className="p-6 space-y-5">
              {/* Date Field */}
              <div>
                <label className="block font-bold mb-2 text-gray-800">📅 Fecha y Hora:</label>
                <input
                  type="text"
                  value={currentLog.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="Ej: 23/09/2025 - 9:30 PM"
                />
              </div>

              {/* Project Field */}
              <div>
                <label className="block font-bold mb-2 text-gray-800">🎯 Proyecto:</label>
                <input
                  type="text"
                  value={currentLog.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="Nombre del proyecto activo"
                />
              </div>

              {/* Time Worked Field */}
              <div>
                <label className="block font-bold mb-2 text-gray-800">⏱️ Tiempo trabajado:</label>
                <input
                  type="text"
                  value={currentLog.timeWorked}
                  onChange={(e) => handleInputChange('timeWorked', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 mb-3"
                  placeholder="Minutos exactos"
                />
                <div className="flex flex-wrap gap-2">
                  {timeOptions.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedTime === time
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-red-500 border border-red-500 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Achievement Field */}
              <div>
                <label className="block font-bold mb-2 text-gray-800">✅ QUÉ LOGRÉ (1 línea específica):</label>
                <input
                  type="text"
                  value={currentLog.achievement}
                  onChange={(e) => handleInputChange('achievement', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="Ej: Terminé wireframes pantalla login + registro"
                />
              </div>

              {/* Evidence Field */}
              <div>
                <label className="block font-bold mb-2 text-gray-800">📸 EVIDENCIA (opcional pero potente):</label>
                <input
                  type="text"
                  value={currentLog.evidence}
                  onChange={(e) => handleInputChange('evidence', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="Ej: Screenshot, archivo guardado, email enviado, etc."
                />
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button
                  onClick={handleSaveLog}
                  className="w-full bg-gradient-to-r from-red-500 to-red-400 text-white font-bold py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-500 transition-all transform hover:scale-[1.02]"
                >
                  💾 Guardar Registro
                </button>
              </div>
            </div>
          </div>

          {/* Templates Section */}
          <div className="bg-gray-50 border-2 border-orange-400 rounded-xl mb-8">
            <div className="bg-orange-400 text-white font-bold p-4 rounded-t-lg">
              📝 PLANTILLAS DE LOGROS (Copy-Paste rápido)
            </div>
            <div className="p-6 space-y-3">
              {templates.map((template, index) => (
                <div
                  key={index}
                  onClick={() => handleTemplateClick(template)}
                  className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all"
                  title="Click para copiar"
                >
                  <div className="text-orange-500 font-bold text-sm mb-1">
                    {template.category}
                  </div>
                  <div className="text-gray-800 text-sm">
                    {template.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="bg-green-50 border-2 border-green-400 rounded-xl mb-8">
            <div className="bg-green-400 text-white font-bold p-4 rounded-t-lg">
              ✅ CHECKLIST: ¿ES PROGRESO REAL?
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {checklist.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center bg-white rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => toggleChecklistItem(item.id)}
                  >
                    <div
                      className={`w-6 h-6 border-2 rounded flex items-center justify-center mr-3 flex-shrink-0 ${
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
                    >
                      {item.checked && (item.isPositive ? '✓' : '✗')}
                    </div>
                    <span className="text-gray-800">{item.text}</span>
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
                  className="bg-white border-l-4 border-blue-400 rounded-r-lg p-4"
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
          <div className="bg-white border-2 border-gray-800 rounded-lg p-6 font-mono print:border-0">
            <div className="text-center font-bold border-b-2 border-gray-800 pb-3 mb-6">
              📋 FORMATO IMPRIMIBLE - REGISTRO SEMANAL
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="border border-gray-300 rounded p-4 min-h-[120px] bg-gray-50">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>FECHA: ___/___/___ | HORA: _____ → _____ | TIEMPO: _____ min</div>
                    <div>PROYECTO: _________________________________________________</div>
                    <div>LOGRO: ___________________________________________________</div>
                    <div>EVIDENCIA: ____________________________________________</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center print:hidden">
              <button
                onClick={handlePrint}
                className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors"
              >
                🖨️ Imprimir Formato
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

