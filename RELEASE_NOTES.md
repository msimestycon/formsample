# Release Notes Guide

Este documento explica cómo agregar notas de versión (release notes) a tus formularios personalizados.

## 📝 ¿Qué son las Release Notes?

Las release notes son descripciones de los cambios realizados en cada versión de un formulario. Aparecen en el panel de administración cuando visualizas el historial de versiones, ayudando a los administradores a entender qué cambió en cada actualización.

## 🚀 Métodos para Agregar Release Notes

### Método 1: Workflow Manual (Recomendado)

Cuando ejecutas el workflow manualmente desde GitHub Actions:

1. Ve a **Actions** → **Build Deployment Package**
2. Haz clic en **Run workflow**
3. Completa los campos:
   - **Version**: `1.2.0` (ejemplo)
   - **Release notes**: Escribe tus cambios aquí

**Ejemplo de release notes:**
```
Nueva funcionalidad de aprobación multi-nivel
- Agregado soporte para 3 niveles de aprobación
- Mejorada validación de campos obligatorios
- Corregido bug en cálculo de totales
```

### Método 2: Mensaje de Commit (Automático)

Si haces un push directamente, el workflow extraerá las release notes del mensaje del commit.

#### Formato Conventional Commits (Recomendado)

```bash
git commit -m "feat: nueva funcionalidad de aprobación

- Agregado soporte para 3 niveles de aprobación
- Mejorada validación de campos obligatorios
- Corregido bug en cálculo de totales"
```

**Tipos de commit reconocidos:**
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `chore:` - Tareas de mantenimiento
- `docs:` - Documentación
- `refactor:` - Refactorización
- `perf:` - Mejoras de performance
- `test:` - Tests

#### Formato Simple

```bash
git commit -m "Mejoras en formulario de aprobación de gastos

- Agregado soporte para 3 niveles
- Validación mejorada
- Bug fix en totales"
```

### Método 3: Por Defecto (Automático)

Si no se proporciona release notes ni por input manual ni por commit, se usará:
```
Version X.X.X - Build automático
```

## 📋 Buenas Prácticas

### ✅ Recomendado

```
- Descripción clara y concisa
- Usar viñetas para listar cambios
- Mencionar breaking changes si aplica
- Incluir números de issue si corresponde
```

**Ejemplo completo:**
```
Versión 2.1.0 - Mejoras de seguridad y UX

Nuevas funcionalidades:
- Validación de archivos adjuntos (tamaño máx 10MB)
- Auto-guardado cada 30 segundos
- Modo dark para formularios

Correcciones:
- Fixed: Error al subir archivos grandes (#123)
- Fixed: Pérdida de datos en navegadores antiguos

Breaking Changes:
- Requiere @tyconsa/bizuit-form-sdk ^2.0.0
```

### ❌ Evitar

```
# Muy genérico
"Bug fixes and improvements"

# Sin contexto
"Updated code"

# Demasiado técnico
"Refactored handleSubmit() to use async/await pattern with Promise.all() for parallel validation"
```

## 🎯 Ejemplos por Tipo de Cambio

### Nueva Funcionalidad
```
feat: soporte para aprobación delegada

- Los aprobadores pueden delegar su aprobación a otros usuarios
- Agregado campo de comentarios obligatorio en delegaciones
- Notificación automática al usuario delegado
```

### Corrección de Bug
```
fix: cálculo incorrecto de impuestos

- Corregido redondeo de decimales en IVA
- Fixed: Error cuando monto es $0
- Mejorada precisión en cálculos
```

### Mejora de Performance
```
perf: optimización de carga de datos

- Reducido tiempo de carga inicial en 60%
- Implementado lazy loading para archivos adjuntos
- Cache de datos de usuario
```

## 📊 Visualización en el Panel Admin

Las release notes aparecen en el **Panel de Administración → Gestión de Formularios → Versiones**:

```
┌─────────────────────────────────────────────────┐
│ v1.2.0  [ACTUAL]                                │
│                                                  │
│ 📝 Cambios en esta versión:                     │
│ Nueva funcionalidad de aprobación multi-nivel   │
│ - Agregado soporte para 3 niveles               │
│ - Mejorada validación de campos                 │
│ - Corregido bug en cálculo de totales           │
│                                                  │
│ Publicado: 19 nov 2025    Tamaño: 11 KB        │
└─────────────────────────────────────────────────┘
```

## 🔄 Workflow Completo

1. **Desarrollo**: Haces cambios en tu formulario
2. **Commit**: Usas conventional commits o mensaje descriptivo
3. **Push**: GitHub Actions se ejecuta automáticamente
4. **Build**: Se genera el deployment package con release notes
5. **Deploy**: Subes el ZIP al panel admin
6. **Historial**: Las release notes aparecen en el panel de versiones

## 📚 Recursos Adicionales

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
