# K'iq'tzal — Frontend

Aplicación web pública de monitoreo experimental del biopurificador K'iq'tzal.
Este repositorio es **independiente** del backend (`kiqtzal-backend`): solo consume
datos por HTTP desde una API REST. Consume las mediciones combinadas
(`dirtyAir` / `cleanAir`) y las muestra en gráficas comparativas en tiempo real.

> **Entregado por @jorge (25/09/2026).** El checklist de despliegue pendiente
> (base de datos, backend, variable `VITE_API_BASE_URL`, firmware) está en
> [`PASOS_SIGUIENTES.md`](https://github.com/AnderGGson/kiqtzal-backend/blob/ft/jorge/PASOS_SIGUIENTES.md).

## Requisitos

- Node.js >= 20.19 (se usa Node 24)

## Comandos

```bash
npm install        # instala dependencias
npm run dev        # entorno de desarrollo con recarga automática (Vite)
npm run build      # typecheck + build de producción en dist/
npm run preview    # previsualiza el build de producción
npm run lint       # ESLint
npm run typecheck  # TypeScript sin emitir
```

## Configuración

Copia `.env.example` a `.env.local`:

```
VITE_API_BASE_URL=http://localhost:3001/api
# VITE_PUBLIC_URL=https://kiqtzal-platform.vercel.app   # (opcional) dato del QR
```

- `VITE_API_BASE_URL`: base del backend (en Vercel apuntar al backend desplegado, ej. `https://kiqtzal-api.onrender.com/api`).
- **Respaldo en runtime**: el dashboard incluye un selector "Backend" para sobrescribir
  esta URL sin redeployar (se guarda en `localStorage` vía `src/config/apiBaseUrl.ts`).
- `VITE_PUBLIC_URL`: si está definida, el QR de la portada la apunta; si no, usa `window.location.origin`.

Todas las variables de entorno que empiezan con `VITE_` son públicas (viajan al
navegador). Todo acceso a `import.meta.env` ocurre en **un único lugar**:
`src/config/env.ts`. Si necesitas una variable nueva, añádela ahí y nunca
leas `import.meta.env` en otro archivo.

## Estructura y responsabilidades

```
kiqtzal-frontend/
├── index.html              # HTML raíz (Vite lo usa como entrada)
├── vite.config.ts          # config de Vite + alias "@/" -> src/
├── tsconfig.json           # raíz de TypeScript (proyectos app + node)
├── tsconfig.app.json       # config TS del código de la app (src/)
├── tsconfig.node.json      # config TS de herramientas (vite.config.ts)
├── eslint.config.js        # ESLint en formato flat config
├── .env.example            # variables de entorno documentadas
└── src/
    ├── main.tsx            # arranca React y monta <App /> en #root
    ├── App.tsx             # renderiza el <RouterProvider /> de react-router
    ├── vite-env.d.ts       # declaraciones de tipos de Vite
    ├── config/
    │   ├── env.ts          # ÚNICO lugar que lee import.meta.env (VITE_*)
    │   └── apiBaseUrl.ts   #   URL del API con override en runtime (localStorage)
    ├── types/              # modelos de dominio y tipos de API (sin lógica)
    │   ├── experiment.ts   #   Experiment y ExperimentMode
    │   ├── measurement.ts  #   Measurement (dirtyAir + cleanAir) y SensorReading
    │   ├── api.ts          #   ApiResult<T>, paginación, query params
    │   └── index.ts        #   barrel: reexporta todo types/
    ├── services/           # capa HTTP. Sin JSX, sin estado de React
    │   ├── httpClient.ts   #   fetch genérico -> ApiResult<T> (maneja errores)
    │   ├── experiments.ts  #   funciones por endpoint de experimentos
    │   └── measurements.ts #   latest + historial por query params
    ├── hooks/              # estado de UI conectado a services
    │   ├── usePolling.ts        #   polling genérico (fetcher + intervalo)
    │   ├── useLatestMeasurement.ts  # última medición (polling)
    │   ├── useMeasurementSeries.ts  # historial reciente para las gráficas
    │   ├── useExperiments.ts        # lista de experimentos
    │   ├── useExperimentById.ts     # un experimento por id
    │   └── useMeasurements.ts       # mediciones de un experimento
    ├── components/         # bloques de UI (reciben datos por props)
    │   ├── common/         #   Spinner, ErrorBanner, EmptyState
    │   ├── layout/         #   Header, Navbar, Footer
    │   ├── experiments/    #   ExperimentCard, ExperimentList, ExperimentDetail
    │   ├── measurements/   #   LatestMeasurementCard, MeasurementsTable, ComparisonSummary
    │   ├── charts/         #   AirQualityChart (recharts, sucio vs limpio)
    │   ├── settings/       #   BackendSettings (URL del API configurable)
    │   └── connection/     #   ConnectionStatus (última medición / sin señal)
    ├── layouts/            # envoltorios con <Outlet /> de react-router
    │   ├── MainLayout.tsx      #   header + main + footer
    │   └── DashboardLayout.tsx #   contenedor del área del dashboard
    ├── pages/              # una página = una ruta
    │   ├── LandingPage.tsx     # portada pública (con QR del sitio)
    │   ├── DashboardPage.tsx   # gráficas en vivo + resumen + experimentos
    │   ├── ExperimentPage.tsx  # detalle de experimento + mediciones
    │   └── NotFoundPage.tsx    # 404
    ├── router/
    │   └── index.tsx       # definición de rutas (createBrowserRouter)
    ├── utils/              # helpers puros y constantes
    │   ├── format.ts       #   fechas, números, tiempo relativo, timeLabel
    │   └── constants.ts    #   POLL_INTERVAL_MS = 5_000, CHART_WINDOW_MS
    └── assets/
        └── styles.css      # estilos globales
```

### Responsabilidad de cada capa

| Carpeta | Qué hace | Qué NO hace |
| ------- | -------- | ----------- |
| `pages/` | define la página completa y orquesta componentes | no llama a `fetch` ni conoce la API |
| `components/` | recibe datos por `props` y los presenta | no llama a `fetch` ni a `services` |
| `hooks/` | convierte la API en estado (`data`, `isLoading`, `error`) | no contiene JSX |
| `services/` | habla con el backend (URLs, cabeceras, errores) | no tiene estado de React |
| `types/` | contratos tipados compartidos | sin lógica |
| `config/` | variables de entorno | nada más |

## Flujo de datos

```
pages ─> hooks ─> services ─HTTP─> Backend API ─> Base de datos
   │         │
   └──> components   (las páginas combinan componentes + hooks)
```

- Una página usa un hook; el hook llama a una función de `services`; esa función
  usa `httpClient` (un único `fetch` tipado). El resultado vuelve como
  `ApiResult<T>`: `{ ok: true, data }` o `{ ok: false, error }`.
- **Los componentes nunca hacen `fetch`**. Para consumir un endpoint nuevo:
  agregar la función en `services/`, el hook en `hooks/`, y usarlo desde la página.
- El dashboard consulta `GET /api/measurements/latest` y `GET /api/measurements` (historial
  reciente) por polling cada `POLL_INTERVAL_MS` (5 s) mediante `usePolling`, y pinta las
  gráficas comparativas con recharts. Si luego necesitas una opción más realista en tiempo real,
  `usePolling` se reemplaza por WebSockets/SSE **sin tocar la UI**.
- La app funciona aunque el ESP32 y el Collector estén apagados: nunca se
  comunica con ellos, solo consume los datos históricos que la API tiene en su base.

## Convenciones

- Importaciones relativas para todo el código de `src/` (ej. `../types`). El alias
  `@/` está configurado y se reserva para importaciones de "raíz" que se acuerden después.
- Usa `import type { ... }` cuando solo importes tipos (afecta al tree-shaking).
- Sin `any`: si un dato viene de la API, modela su tipo en `types/`.
- Estados coherentes: toda consulta devuelve `data | null`, `isLoading`, `error: string | null`;
  las capas de presentación deciden si mostrar `Spinner`, `ErrorBanner` o `EmptyState`.
- Las únicas variables de entorno públicas son las que están en `config/env.ts`.

## Contrato con el backend

| Endpoint | Uso en el frontend |
| -------- | ------------------ |
| `GET /api/experiments` | listar experimentos |
| `GET /api/experiments/:id` | detalle de experimento |
| `GET /api/experiments/:id/measurements` | mediciones históricas |
| `GET /api/measurements/latest` | última medición combinada (`null` = sin señal) |
| `GET /api/measurements?from&to&after&limit` | historial reciente para las gráficas |
| `POST /api/measurements` | solo lo usa el firmware del ESP32, no el frontend |
| `GET /api/health` | verificar que el backend está arriba |

## Estado actual

- Gráficas reales: `AirQualityChart` (recharts) compara `dirtyAir` vs `cleanAir` por métrica (gas, humedad, temperatura).
- Resumen en vivo: `ComparisonSummary` muestra ambas lecturas y el % de reducción de gas.
- Tiempo real: polling cada 5 s (listo para migrar a WebSockets/SSE sin tocar la UI).
- URL del backend configurable en runtime (`BackendSettings` → `localStorage`) como respaldo para la demo.
- Datos demo: el backend tiene `npm run simulate` para generar lecturas sin sensores.