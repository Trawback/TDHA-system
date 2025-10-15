# Guía de Desarrollo - Sistema TDAH

Esta guía está dirigida a desarrolladores que quieran contribuir o extender el sistema.

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos

```
src/app/
├── components/
│   └── TDAHSystem.tsx       # Componente principal del sistema
├── types/
│   └── index.ts             # TypeScript type definitions
├── utils/
│   ├── storage.ts           # LocalStorage management
│   └── formatters.ts        # Utility formatting functions
├── layout.tsx               # Root layout con metadata
├── page.tsx                 # Entry point
└── globals.css              # Global styles + print styles
```

### Tecnologías Utilizadas

- **Next.js 15.5.5**: App Router, Server & Client Components
- **React 19.1.0**: Hooks (useState, useEffect)
- **TypeScript 5+**: Type safety en toda la aplicación
- **Tailwind CSS v4**: Utility-first CSS framework
- **LocalStorage API**: Persistencia de datos del lado del cliente

## 🔧 Componentes Principales

### TDAHSystem Component

**Ubicación**: `src/app/components/TDAHSystem.tsx`

**Responsabilidades**:
- Gestión del formulario de registro
- Validación de datos
- Persistencia en localStorage
- UI interactiva con templates y checklists
- Funcionalidad de impresión

**Estado Principal**:
```typescript
const [currentLog, setCurrentLog] = useState<LogEntry>()
const [savedLogs, setSavedLogs] = useState<LogEntry[]>()
const [checklist, setChecklist] = useState<ChecklistItem[]>()
const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>()
```

**Props**: Ninguno (componente standalone)

### Types System

**Ubicación**: `src/app/types/index.ts`

Definiciones de tipos centralizadas:
- `LogEntry`: Estructura de un registro de trabajo
- `TemplateItem`: Plantillas de logros
- `ChecklistItem`: Items de validación
- `ExampleLog`: Logs de ejemplo
- `SystemStats`: Estadísticas del sistema

### Storage Utilities

**Ubicación**: `src/app/utils/storage.ts`

Funciones para manejo de localStorage:
- `getLogEntries()`: Obtener todos los registros
- `saveLogEntry(entry)`: Guardar un nuevo registro
- `deleteLogEntry(id)`: Eliminar un registro
- `updateLogEntry(id, updates)`: Actualizar un registro
- `exportLogsAsJSON()`: Exportar registros como JSON
- `exportLogsAsCSV()`: Exportar registros como CSV
- `getStats()`: Obtener estadísticas

### Formatters

**Ubicación**: `src/app/utils/formatters.ts`

Utilidades de formateo:
- `formatDate()`: Formatear fechas al estilo español
- `parseTimeToMinutes()`: Convertir string de tiempo a minutos
- `validateLogEntry()`: Validar un registro completo
- `truncateText()`: Truncar texto largo
- `getTimeColorClass()`: Obtener clase de color según tiempo

## 🎨 Guía de Estilos

### Paleta de Colores

```css
Red (Principal):     rgb(239, 68, 68)   - #EF4444  - red-500
Orange (Templates):  rgb(251, 146, 60)  - #FB923C  - orange-400
Green (Validation):  rgb(34, 197, 94)   - #22C55E  - green-400
Blue (Examples):     rgb(59, 130, 246)  - #3B82F6  - blue-400
```

### Breakpoints Tailwind

```css
sm: 640px   - Tablets pequeñas
md: 768px   - Tablets
lg: 1024px  - Laptops
xl: 1280px  - Desktops
2xl: 1536px - Pantallas grandes
```

### Componentes Reutilizables

Todos los botones, inputs y cards siguen patrones consistentes:

**Botones principales**:
```tsx
className="bg-gradient-to-r from-red-500 to-red-400 text-white font-bold py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-500 transition-all"
```

**Inputs**:
```tsx
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
```

## 🚀 Añadir Nuevas Características

### Ejemplo: Añadir un nuevo campo al formulario

1. **Actualizar el tipo LogEntry**:
```typescript
// src/app/types/index.ts
export interface LogEntry {
  // ... campos existentes
  priority?: 'low' | 'medium' | 'high'; // Nuevo campo
}
```

2. **Actualizar el estado inicial**:
```typescript
// src/app/components/TDAHSystem.tsx
const [currentLog, setCurrentLog] = useState<LogEntry>({
  // ... campos existentes
  priority: 'medium',
});
```

3. **Añadir el input en el JSX**:
```tsx
<div>
  <label className="block font-bold mb-2 text-gray-800">
    📌 Prioridad:
  </label>
  <select
    value={currentLog.priority}
    onChange={(e) => handleInputChange('priority', e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
  >
    <option value="low">Baja</option>
    <option value="medium">Media</option>
    <option value="high">Alta</option>
  </select>
</div>
```

### Ejemplo: Añadir una nueva plantilla

```typescript
// En el array templates dentro de TDAHSystem.tsx
const templates: TemplateItem[] = [
  // ... plantillas existentes
  {
    category: '🆕 TU CATEGORÍA:',
    text: '"Tu plantilla aquí con [PLACEHOLDER] para completar"'
  },
];
```

### Ejemplo: Integrar una base de datos

1. **Instalar cliente de DB** (ejemplo con Supabase):
```bash
pnpm add @supabase/supabase-js
```

2. **Crear cliente**:
```typescript
// src/app/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

3. **Modificar storage.ts**:
```typescript
import { supabase } from '../lib/supabase'

export const saveLogEntry = async (entry: LogEntry): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('log_entries')
      .insert([entry])
    
    return !error
  } catch (error) {
    console.error('Error:', error)
    return false
  }
}
```

## 📊 Testing

### Configurar Jest (opcional)

```bash
pnpm add -D jest @testing-library/react @testing-library/jest-dom
```

### Ejemplo de test unitario:

```typescript
// src/app/utils/__tests__/formatters.test.ts
import { formatDate, parseTimeToMinutes } from '../formatters'

describe('Formatters', () => {
  test('parseTimeToMinutes should convert correctly', () => {
    expect(parseTimeToMinutes('30 min')).toBe(30)
    expect(parseTimeToMinutes('90 min')).toBe(90)
  })
})
```

## 🔐 Variables de Entorno

Crear un archivo `.env.local` para configuraciones:

```env
# Base URL de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (si se integra)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Analytics (si se integra)
NEXT_PUBLIC_GA_ID=your_ga_id
```

## 🐛 Debugging

### React DevTools

Instalar la extensión de navegador React DevTools para inspeccionar componentes y estado.

### Console Logs Estratégicos

```typescript
// En desarrollo, usar console.log para debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Current log:', currentLog)
}
```

### Errores Comunes

**Error: "window is not defined"**
- Solución: Usar `typeof window !== 'undefined'` antes de acceder a APIs del navegador
- Ya implementado en storage.ts y component handlers

**Error: "localStorage is not defined"**
- Solución: Mismo que anterior, verificar en storage.ts

## 🎯 Performance Optimization

### Code Splitting

Next.js hace code splitting automáticamente, pero puedes optimizar más:

```typescript
// Lazy load de componentes grandes
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
})
```

### Memoization

Para componentes que se re-renderizan frecuentemente:

```typescript
import { memo, useMemo, useCallback } from 'react'

const ExpensiveComponent = memo(({ data }) => {
  // Component code
})

// En el componente padre:
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b])
```

## 📱 Progressive Web App (PWA)

Para convertir en PWA:

1. **Instalar next-pwa**:
```bash
pnpm add next-pwa
```

2. **Configurar next.config.ts**:
```typescript
const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA({
  // ... config
})
```

3. **Crear manifest.json** en `/public`

## 🚢 Deployment

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Build para producción

```bash
pnpm build
pnpm start
```

### Docker (opcional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 📚 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 License

Este proyecto es de código abierto para uso personal y educativo.

---

**Última actualización**: Octubre 2025

