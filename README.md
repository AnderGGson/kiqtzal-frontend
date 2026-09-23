# K'iq'tzal — Frontend

Aplicación web pública de monitoreo experimental del biopurificador K'iq'tzal.
Este repositorio es **independiente** del backend (`kiqtzal-backend`) y del
Python Collector: solo consume datos por HTTP desde una API REST.

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
```

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
    │   └── env.ts          # ÚNICO lugar que lee import.meta.env (VITE_*)
    ├── types/              # modelos de dominio y tipos de API (sin lógica)
    │   ├── experiment.ts   #   Experiment y ExperimentMode
    │   ├── measurement.ts  #   Measurement
    │   ├── api.ts          #   ApiResult<T>, paginación, query params
    │   └── index.ts        #   barrel: reexporta todo types/
    ├── services/           # capa HTTP. Sin JSX, sin estado de React
    │   ├── httpClient.ts   #   fetch genérico -> ApiResult<T> (maneja errores)
    │   ├── experiments.ts  #   funciones por endpoint de experimentos
    │   └── measurements.ts #   funciones por endpoint de mediciones
    ├── hooks/              # estado de UI conectado a services
    │   ├── usePolling.ts        #   polling genérico (fetcher + intervalo)
    │   ├── useLatestMeasurement.ts  # última medición con polling de 30 s
    │   ├── useExperiments.ts        # lista de experimentos
    │   ├── useExperimentById.ts     # un experimento por id
    │   └── useMeasurements.ts       # mediciones de un experimento
    ├── components/         # bloques de UI (reciben datos por props)
    │   ├── common/         #   Spinner, ErrorBanner, EmptyState
    │   ├── layout/         #   Header, Navbar, Footer
    │   ├── experiments/    #   ExperimentCard, ExperimentList, ExperimentDetail
    │   ├── measurements/   #   LatestMeasurementCard, MeasurementsTable
    │   ├── charts/         #   ChartPlaceholder (aisla las gráficas futuras)
    │   └── connection/     #   ConnectionStatus (última medición / sin señal)
    ├── layouts/            # envoltorios con <Outlet /> de react-router
    │   ├── MainLayout.tsx      #   header + main + footer
    │   └── DashboardLayout.tsx #   contenedor del área del dashboard
    ├── pages/              # una página = una ruta
    │   ├── LandingPage.tsx     # portada pública
    │   ├── DashboardPage.tsx   # estado actual, última medición, expis
    │   ├── ExperimentPage.tsx  # detalle de experimento + mediciones
    │   └── NotFoundPage.tsx    # 404
    ├── router/
    │   └── index.tsx       # definición de rutas (createBrowserRouter)
    ├── utils/              # helpers puros y constantes
    │   ├── format.ts       #   fechas, números, tiempo relativo
    │   └── constants.ts    #   POLL_INTERVAL_MS = 30_000
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
- El dashboard consulta `GET /api/measurements/latest` por polling cada `POLL_INTERVAL_MS`
  (30 s) mediante `usePolling`. Si luego necesitas una opción más realista en
  tiempo real, `usePolling` se reemplaza por WebSockets/SSE **sin tocar la UI**.
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
| `GET /api/measurements/latest` | última medición (`null` = sin señal) |
| `POST /api/measurements` | solo la usa el Python Collector, no el frontend |
| `GET /api/health` | verificar que el backend está arriba |

## Estado del scaffolding

Preparado pero **sin implementar** a propósito:

- Gráficas reales: solo existe `ChartPlaceholder`; se elegirá una librería luego.
- Autenticación: ninguna; la app es pública.
- Tiempo real: el polling está listo; WebSockets/SSE no existen todavía.
- Datos demo/mock: no hay; la app muestra estados vacíos hasta tener backend y datos.