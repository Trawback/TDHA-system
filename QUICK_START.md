# ⚡ Quick Start - Sistema TDAH

## 🚀 En 2 Minutos

### 1. Instalar
```bash
pnpm install
```

### 2. Ejecutar
```bash
pnpm dev
```

### 3. Abrir
Navega a [http://localhost:3000](http://localhost:3000)

---

## 🎯 Primera Vez - Guía Rápida

### Tab "Nuevo Registro"
1. **Proyecto**: Escribe el nombre (ej: "App Móvil")
2. **Tiempo**: Click en "30 min" o el que usaste
3. **Logro**: Describe qué completaste (ej: "Diseñé pantalla de login → login.fig guardado")
4. **Evidencia** (opcional): Añade prueba (ej: "Screenshot login_v1.png")
5. **Click "Guardar"** o presiona `Ctrl+S`

✅ ¡Listo! Tu primer registro está guardado.

### Tab "Dashboard"
- Ve tus estadísticas en tiempo real
- Revisa tu progreso semanal
- 6 métricas diferentes

### Tab "Historial"
- Ve todos tus registros
- Busca por proyecto o logro
- Exporta a JSON o CSV
- Edita o elimina registros

---

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + S` | Guardar registro |
| `Ctrl + K` | Quick access a botones de tiempo |
| `Ctrl + D` | Toggle modo oscuro/claro |

---

## 💡 Tips Esenciales

### ✅ Buenos Registros
```
✓ "Completé 3 wireframes → archivo designs_v2.fig"
✓ "Escribí 1,200 palabras capítulo 3 → Google Doc actualizado"
✓ "Implementé login con Google → commit abc123f"
```

### ❌ Malos Registros
```
✗ "Trabajé en el proyecto"
✗ "Investigué sobre React"
✗ "Vi tutoriales"
```

**La diferencia**: Los buenos tienen resultado tangible + evidencia.

---

## 📱 Plantillas Rápidas

Haz click en cualquier plantilla para copiarla, luego:
1. Pégala en "QUÉ LOGRÉ"
2. Reemplaza los valores entre [corchetes]
3. ¡Listo!

**Ejemplo**:
- Plantilla: `"Completé [X funcionalidad] → archivo [nombre.ext] guardado"`
- Tu versión: `"Completé sistema de login → archivo auth.tsx guardado"`

---

## 🎨 Personalización Rápida

### Cambiar Colores
Edita `src/app/globals.css`:
```css
/* Cambia el color principal */
.text-red-500 → .text-blue-500
.bg-red-500 → .bg-blue-500
```

### Añadir Más Tiempos
Edita `src/app/components/TDAHSystemEnhanced.tsx`:
```typescript
const timeOptions = ['15 min', '30 min', '45 min', '60 min', '90 min', '120 min', '180 min'];
```

### Añadir Plantilla Personalizada
```typescript
const templates: TemplateItem[] = [
  // ... existentes
  {
    category: '🎯 TU CATEGORÍA:',
    text: '"Tu plantilla aquí"'
  },
];
```

---

## 📊 Entender el Dashboard

### Tarjetas de Métricas
- **🎯 Sesiones Totales**: Cuántas veces has registrado trabajo
- **⏱️ Tiempo Total**: Minutos acumulados
- **📁 Proyectos Activos**: Proyectos únicos que tienes
- **📊 Promedio por Sesión**: Tiempo promedio que trabajas
- **📸 Con Evidencia**: % de registros que tienen evidencia
- **🔥 Últimos 7 Días**: Sesiones esta semana

### Meta Semanal
- **Objetivo**: 7 sesiones por semana
- **Barra verde**: Muestra tu progreso
- **Al llegar a 7**: ¡Mensaje de felicitación!

---

## 💾 Exportar Tus Datos

### JSON (Programadores)
1. Tab "Historial"
2. Click "📥 JSON"
3. Se descarga `tdah-logs-2025-10-15.json`

### CSV (Excel/Google Sheets)
1. Tab "Historial"
2. Click "📥 CSV"
3. Se descarga `tdah-logs-2025-10-15.csv`
4. Abre en Excel/Sheets

---

## 🔍 Buscar Registros

### Búsqueda Instantánea
Escribe en el campo "🔍 Buscar" cualquier palabra:
- Busca en proyecto
- Busca en logro
- Busca en evidencia

### Filtrar por Proyecto
Dropdown "📁 Filtrar por Proyecto":
- Selecciona un proyecto específico
- Solo muestra registros de ese proyecto

### Ordenar
Dropdown "📊 Ordenar por":
- **Fecha**: Más recientes primero
- **Proyecto**: A-Z alfabéticamente
- **Tiempo**: Sesiones más largas primero

---

## 🖨️ Imprimir Formato

1. Scroll hasta "📋 FORMATO IMPRIMIBLE"
2. Click "🖨️ Imprimir Formato"
3. Selecciona tu impresora
4. ¡Úsalo para escribir a mano!

**Útil para**:
- Tener registro físico visible
- Escribir cuando no tienes computadora
- Backup físico

---

## 🌙 Modo Oscuro

### Activar
- Click en 🌙 (arriba a la derecha)
- O presiona `Ctrl+D`

### Se guarda automáticamente
- La próxima vez que abras, estará como lo dejaste

---

## ❓ Problemas Comunes

### "No veo mis registros"
- Verifica que estés en el tab correcto
- Revisa que no haya filtros activos
- Los datos están en localStorage (en tu navegador)

### "Perdí mis datos"
- Si limpiaste el caché del navegador, se borran
- **Solución**: Exporta regularmente a JSON/CSV
- **Futuro**: v2.0 tendrá cloud sync

### "Quiero borrar todo"
```javascript
// En la consola del navegador (F12):
localStorage.removeItem('tdah_system_logs')
```

### "No funciona el dark mode"
- Verifica que tu navegador soporte localStorage
- Prueba en modo incógnito
- Limpia caché y recarga

---

## 📚 Más Información

- **Guía Completa**: Ver `USAGE_GUIDE.md`
- **Para Desarrolladores**: Ver `DEVELOPMENT.md`
- **Mejoras Implementadas**: Ver `IMPROVEMENTS.md`
- **Historial**: Ver `CHANGELOG.md`

---

## 🎯 Checklist Primer Uso

- [ ] Instalé dependencias (`pnpm install`)
- [ ] Ejecuté el proyecto (`pnpm dev`)
- [ ] Abrí [http://localhost:3000](http://localhost:3000)
- [ ] Registré mi primera sesión
- [ ] Exploré el Dashboard
- [ ] Busqué en el Historial
- [ ] Probé el modo oscuro
- [ ] Usé un keyboard shortcut
- [ ] Copié una plantilla
- [ ] Exporté mis datos

---

## 💪 Tips de Productividad

### Para TDAH
1. **Usa cronómetro mientras trabajas** - No adivines el tiempo
2. **Documenta INMEDIATAMENTE** - Antes de que olvides
3. **Sé específico** - "Completé X" no "Trabajé en X"
4. **Incluye evidencia siempre** - Prueba tangible
5. **Revisa Dashboard semanalmente** - Ve tu progreso

### Para Desarrolladores
1. **Lee DEVELOPMENT.md** - Arquitectura completa
2. **Usa los tipos TypeScript** - Están en `types/index.ts`
3. **Reutiliza utilidades** - `utils/` tiene helpers
4. **Sigue la estructura** - Components, utils, types
5. **Documenta cambios** - Actualiza CHANGELOG.md

---

## 🚀 Siguiente Nivel

### Deploy Gratis en Vercel
```bash
# Instala Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Sigue las instrucciones
# ¡Listo! Tendrás una URL pública
```

### Conectar con GitHub
1. Sube a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. "New Project" → Importa tu repo
4. Deploy automático en cada push

---

**¿Listo para empezar? 🎉**

```bash
pnpm dev
```

¡Abre [http://localhost:3000](http://localhost:3000) y comienza a documentar tu progreso!

