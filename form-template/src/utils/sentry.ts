/**
 * Sentry/GlitchTip Integration for Production Logging
 *
 * En desarrollo (DEV_MODE=true): console.* funciona normal
 * En produccion:
 *   - console.log -> silenciado, queda como breadcrumb
 *   - console.warn -> silenciado, va a GlitchTip como evento
 *   - console.error -> visible en consola + va a GlitchTip como evento
 *
 * Configuracion:
 *   1. Crear cuenta en https://app.glitchtip.com/
 *   2. Crear proyecto y obtener DSN
 *   3. Reemplazar el DSN placeholder abajo
 *   4. (Opcional) Configurar Allowed Domains en GlitchTip Settings > Security
 */
import * as Sentry from "@sentry/react";

const isDev = typeof window !== 'undefined' && (window as any).DEV_MODE === true;

// Solo inicializar GlitchTip en produccion (evita errores CORS en dev)
if (typeof window !== 'undefined' && !isDev) {
  Sentry.init({
    // TODO: Reemplazar con tu DSN de GlitchTip
    // Obtener en: https://app.glitchtip.com/ -> Tu Proyecto -> Settings -> DSN
    dsn: "https://YOUR_KEY@app.glitchtip.com/YOUR_PROJECT_ID",
    environment: "production",
    integrations: [
      Sentry.captureConsoleIntegration({ levels: ['warn', 'error'] }),
    ],
  });

  // Silenciar console.log en prod (queda como breadcrumb para contexto)
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    Sentry.addBreadcrumb({
      category: 'console',
      message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '),
      level: 'info',
    });
  };

  // Silenciar console.warn en prod (ya va a GlitchTip via captureConsoleIntegration)
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    // No mostrar en consola, GlitchTip ya lo captura como evento
  };

  // console.error: mantener visible en consola + GlitchTip lo captura automaticamente
  // No necesitamos override, captureConsoleIntegration ya lo maneja
}

export { Sentry };
