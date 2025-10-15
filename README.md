# Sistema de Documentación TDAH - 30 Minutos ⚡

Sistema profesional de registro y documentación de progreso real diseñado específicamente para personas con TDAH. Permite documentar tu trabajo en tan solo 30 segundos con características de nivel empresarial.

## ⭐ Características Destacadas v1.0.0

### 🎯 Sistema de Registro
- ✅ **Registro Rápido**: Formulario optimizado para documentación en 30 segundos
- ✅ **Validación en Tiempo Real**: Feedback inmediato con mensajes de error contextuales
- ✅ **Selección Rápida de Tiempo**: Botones para 30, 45, 60, 90, 120 minutos
- ✅ **Plantillas Copy-Paste**: 6 categorías predefinidas para diferentes tipos de trabajo
- ✅ **Auto-guardado de Preferencias**: Persistencia en localStorage

### 📊 Dashboard de Progreso
- ✅ **6 Métricas en Tiempo Real**:
  - Total de sesiones de trabajo
  - Tiempo total acumulado
  - Proyectos activos
  - Promedio por sesión
  - Porcentaje con evidencia
  - Actividad últimos 7 días
- ✅ **Barra de Progreso Semanal**: Meta de 7 sesiones con animación
- ✅ **Visualización Atractiva**: Gradientes y diseño moderno

### 📚 Historial Completo
- ✅ **Búsqueda en Tiempo Real**: Busca en proyecto, logro o evidencia
- ✅ **Filtros Avanzados**: Por proyecto, fecha o tiempo
- ✅ **Ordenamiento Múltiple**: Por fecha, proyecto o duración
- ✅ **Edición de Registros**: Modifica entradas guardadas
- ✅ **Eliminación con Confirmación**: Protección contra borrado accidental
- ✅ **Exportación de Datos**: JSON y CSV

### 🎨 UX/UI Mejorado
- ✅ **Navegación por Tabs**: 3 secciones organizadas (Registro, Dashboard, Historial)
- ✅ **Animaciones Suaves**: Fade-in, slide-in, scale transitions
- ✅ **Toast Notifications**: 4 tipos (success, error, warning, info)
- ✅ **Tema Oscuro**: Toggle con persistencia y shortcut (Ctrl+D)
- ✅ **Diseño Responsivo**: Mobile-first, optimizado para todos los dispositivos
- ✅ **Scrollbar Personalizado**: Estilizado y suave

### ⌨️ Productividad
- ✅ **Keyboard Shortcuts**:
  - `Ctrl+S` / `Cmd+S`: Guardar registro
  - `Ctrl+K` / `Cmd+K`: Quick access a tiempo
  - `Ctrl+D` / `Cmd+D`: Toggle dark mode
- ✅ **Formato Imprimible**: Optimizado para registro físico
- ✅ **Checklist Interactivo**: 6 puntos de validación de progreso real

### ♿ Accesibilidad (WCAG AA)
- ✅ **Navegación por Teclado**: 100% navegable sin mouse
- ✅ **Screen Reader Support**: ARIA labels completos
- ✅ **Focus Visible**: Outline claro en todos los elementos
- ✅ **Contraste Optimizado**: Cumple estándares WCAG
- ✅ **Skip to Main Content**: Para usuarios de lectores de pantalla

### 🛠️ Stack Tecnológico

- **Framework**: Next.js 15.5.5
- **React**: 19.1.0
- **TypeScript**: Tipado completo para seguridad de tipos
- **Tailwind CSS**: v4 - Estilos modernos y responsivos
- **Gestión de Estado**: React Hooks (useState)

## 📁 Estructura del Proyecto

```
tdha-system/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── TDAHSystem.tsx    # Componente principal del sistema
│   │   ├── layout.tsx             # Layout raíz con metadata
│   │   ├── page.tsx               # Página principal
│   │   └── globals.css            # Estilos globales + print styles
│   └── ...
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 20 o superior
- pnpm (recomendado) o npm

### Instalación

1. Clonar el repositorio:
```bash
cd tdha-system
```

2. Instalar dependencias:
```bash
pnpm install
# o
npm install
```

3. Ejecutar en modo desarrollo:
```bash
pnpm dev
# o
npm run dev
```

4. Abrir en el navegador:
```
http://localhost:3000
```

### Compilar para Producción

```bash
pnpm build
# o
npm run build
```

### Iniciar servidor de producción:
```bash
pnpm start
# o
npm start
```

## 💡 Cómo Usar el Sistema

### Inicio Rápido

1. **Tab "Nuevo Registro"**: Documenta tu sesión de trabajo
   - Fecha y hora se completan automáticamente
   - Selecciona tu proyecto
   - Elige tiempo trabajado (botones rápidos)
   - Describe tu logro específico
   - Añade evidencia (opcional pero poderoso)
   - Guarda con `Ctrl+S` o botón

2. **Tab "Dashboard"**: Visualiza tu progreso
   - Ve tus estadísticas en tiempo real
   - Revisa tu meta semanal
   - Analiza tu productividad

3. **Tab "Historial"**: Gestiona tus registros
   - Busca registros específicos
   - Filtra por proyecto
   - Ordena por fecha/tiempo
   - Edita o elimina entradas
   - Exporta a JSON/CSV

### Uso de Plantillas

Las plantillas están organizadas por categorías:
- 📱 Desarrollo/Diseño
- 📚 Contenido/Escritura
- 📊 Investigación/Análisis
- 📧 Comunicación/Gestión
- 🎨 Creativo/Visual
- 🔧 Organización/Setup

**Haz clic en cualquier plantilla** para copiarla al portapapeles y adaptarla a tu caso.

### Checklist de Validación

Usa el checklist interactivo para verificar que tu registro representa progreso real:

✅ **SÍ CUENTA** (Debe cumplirse):
- Trabajaste mínimo 30 minutos concentrados
- Hay algo tangible que no existía antes
- Puedes mostrar evidencia específica
- El proyecto está más cerca de completarse

❌ **NO CUENTA**:
- Solo leer, planear, organizar archivos, ver tutoriales
- "Trabajé en..." sin resultado específico

### Formato Imprimible

1. Desplázate hasta la sección "FORMATO IMPRIMIBLE"
2. Haz clic en el botón "🖨️ Imprimir Formato"
3. Usa el formato impreso para registro manual si lo prefieres

## 🎨 Personalización

### Modificar Plantillas

Edita el array `templates` en `src/app/components/TDAHSystem.tsx`:

```typescript
const templates: TemplateItem[] = [
  {
    category: '🆕 TU CATEGORÍA:',
    text: '"Tu plantilla personalizada aquí"'
  },
  // ... más plantillas
];
```

### Cambiar Opciones de Tiempo

Modifica el array `timeOptions`:

```typescript
const timeOptions = ['15 min', '30 min', '45 min', '60 min', '90 min', '120 min', '180 min'];
```

### Estilos y Colores

Los colores principales están definidos con Tailwind CSS:
- **Rojo**: `red-500` - Color principal del sistema
- **Naranja**: `orange-400` - Sección de plantillas
- **Verde**: `green-400` - Checklist de validación
- **Azul**: `blue-400` - Ejemplos

Puedes modificarlos en las clases de Tailwind en `TDAHSystem.tsx`.

## 🚀 Features Implementadas

### ✅ Completadas en v1.0.0
- [x] localStorage para persistencia
- [x] Exportar a JSON/CSV
- [x] Dashboard con estadísticas
- [x] Gráficos de progreso
- [x] Toast notifications
- [x] Tema oscuro
- [x] Animaciones de transición
- [x] Atajos de teclado
- [x] Búsqueda y filtros avanzados
- [x] Edición de registros
- [x] Validación en tiempo real
- [x] Accesibilidad WCAG AA
- [x] Responsive mobile-first
- [x] Sistema de tabs

## 🔮 Próximas Mejoras (Roadmap)

### v1.1.0 - Productividad Avanzada
- [ ] Cronómetro Pomodoro integrado
- [ ] Notificaciones del navegador
- [ ] Recordatorios programables
- [ ] Vista de calendario
- [ ] Drag & drop para reordenar
- [ ] Categorías personalizables
- [ ] Tags para registros

### v1.2.0 - PWA y Offline
- [ ] Progressive Web App (PWA)
- [ ] Modo offline completo
- [ ] Service Worker
- [ ] App installable
- [ ] Push notifications

### v2.0.0 - Cloud y Colaboración
- [ ] Base de datos (Supabase/Firebase)
- [ ] Autenticación de usuarios
- [ ] Sincronización multi-dispositivo
- [ ] API REST
- [ ] Compartir progreso
- [ ] Equipos y colaboración

## 📝 Integración Realizada

### Del HTML Original al Componente React

**Cambios Principales:**

1. ✅ **Convertido a TypeScript** con interfaces completas
2. ✅ **Gestión de estado con React Hooks** (useState)
3. ✅ **Estilos migrados a Tailwind CSS** desde CSS inline
4. ✅ **Componente 'use client'** para interactividad
5. ✅ **Formularios controlados** con React
6. ✅ **Event handlers** para toda la interactividad
7. ✅ **Auto-formato de fecha** en español
8. ✅ **Funcionalidad de impresión** optimizada
9. ✅ **Copy-paste de plantillas** con clipboard API
10. ✅ **Responsividad móvil** con Tailwind breakpoints

### Mejoras sobre el Original

- **TypeScript**: Seguridad de tipos completa
- **Modularidad**: Componente reutilizable
- **Performance**: Optimizado para React 19
- **Accesibilidad**: Mejores prácticas de a11y
- **Mantenibilidad**: Código limpio y organizado
- **Escalabilidad**: Fácil de extender con nuevas features

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está diseñado para uso personal y profesional.

## 👨‍💻 Soporte

Para preguntas, sugerencias o reportar bugs, por favor abre un issue en el repositorio.

---

**Desarrollado con ❤️ para la comunidad TDAH**

🎯 Recuerda: Documentar no es perder tiempo, es **asegurar tu progreso**.
