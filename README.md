# K'iq'tzal — Frontend

Aplicación web pública de monitoreo del biopurificador K'iq'tzal. Es independiente del backend:
solo consume datos por HTTP desde la API REST desplegada en
`https://kiqtzal-backend.vercel.app`.

- Última lectura e historial con `GET` (el navegador nunca envía datos).
- Gráficas comparativas de temperatura, humedad y gas con Recharts, actualizadas por polling.
- Semáforos de calidad (verde = muy bueno, amarillo = normal, rojo = peligroso) por zona y por métrica.

## Requisitos

- Node.js >= 20.19

## Comandos

```bash
npm install        # instala dependencias
npm run dev        # entorno de desarrollo (Vite)
npm run build      # typecheck + build de producción en dist/
npm run preview    # previsualiza el build de producción
npm run lint       # ESLint
npm run typecheck  # TypeScript sin emitir
```

## Configuración

Copia `.env.example` a `.env.local` solo si necesitas cambiar algo:

```
VITE_API_BASE_URL=https://kiqtzal-backend.vercel.app/api
# VITE_PUBLIC_URL=https://kiqtzal-platform.vercel.app   # (opcional) dato del QR
```

- `VITE_API_BASE_URL`: base de la API, **incluyendo `/api`**. Si no se define, el código usa la
  URL de producción anterior, así que el frontend funciona sin configurar nada.
- `VITE_PUBLIC_URL`: si está definida, el QR de la portada la apunta; si no, usa `window.location.origin`.
- Todas las variables `VITE_*` son públicas. Toda lectura de `import.meta.env` ocurre únicamente en
  `src/config/env.ts`.
- No hay override de URL en el navegador: la única fuente es `VITE_API_BASE_URL` (o el valor por
  defecto del código).

## Estructura y responsabilidades

```
src/
├── config/
│   ├── env.ts                  # ÚNICO lugar que lee import.meta.env
│   ├── apiBaseUrl.ts           # normaliza la URL base de la API
│   └── qualityThresholds.ts    # ÚNICO lugar con los umbrales del semáforo
├── types/                      # contratos: api.ts, measurement.ts, quality.ts
├── services/                   # capa HTTP (sin JSX, sin estado de React)
│   ├── httpClient.ts           # fetch GET: errores, timeout, cancelación, JSON
│   ├── measurements.ts         # /measurements/latest y /measurements
│   ├── measurementMapper.ts    # normaliza el payload plano de la API al modelo de la UI
│   └── health.ts               # /health
├── hooks/                      # estado de UI
│   ├── usePolling.ts           # polling genérico (secuencial, backoff, visibilidad)
│   ├── useMeasurementSeries.ts # historial de la ventana seleccionada
│   ├── useLatestMeasurement.ts # /latest, solo cuando la ventana no tiene datos
│   ├── useHealth.ts            # estado de la API y la base de datos
│   └── useHistory.ts           # historial paginado por intervalo
├── components/
│   ├── charts/AirQualityChart  # Recharts + líneas de umbral
│   ├── measurements/
│   │   ├── ComparisonSummary   # estado general + zonas
│   │   ├── QualityTrafficLight # foquito accesible (color + texto + motivo)
│   │   └── MeasurementsTable   # tabla de historial con foquitos por fila
│   ├── connection/ConnectionStatus
│   └── common/                 # Spinner, ErrorBanner, EmptyState, TimeWindowSelector
├── pages/                      # LandingPage, DashboardPage, HistoryPage, NotFoundPage
├── utils/                      # format.ts, quality.ts, constants.ts
└── assets/styles.css           # tokens de color, semáforos, modo oscuro
```

Reglas: `pages/` orquesta, `components/` solo presenta, `hooks/` convierten la API en estado,
`services/` hablan con la API, `types/` no tienen lógica.

## Contrato con la API

| Endpoint | Uso en el frontend |
| -------- | ------------------ |
| `GET /api/health` | estado de la API y de la base de datos |
| `GET /api/measurements?from&to&limit&offset` | historial: alimenta gráficas, última lectura y tabla |
| `GET /api/measurements/latest` | se consulta solo cuando el intervalo seleccionado no tiene datos, para indicar la antigüedad de la lectura más reciente |
| `POST /api/measurements` | solo lo usa el Collector, nunca el navegador |

La API responde el objeto plano:

```json
{
  "id": 2,
  "temp_abajo": 24.8,
  "hum_abajo": 60.1,
  "mq_abajo_raw": 120,
  "temp_arriba": 25.3,
  "hum_arriba": 58.4,
  "mq_arriba_raw": 130,
  "created_at": "2026-09-25T09:12:32.564Z"
}
```

`src/services/measurementMapper.ts` lo convierte al modelo que usa la UI:

- `abajo` → zona **entrada** (aire sin tratar)
- `arriba` → zona **salida** (aire tratado)
- `mq_*_raw` → `gasRaw`: **lectura cruda del sensor MQ**, no ppm
- `created_at` → `timestamp` ISO, y la serie siempre queda ordenada de más antigua a más reciente

El historial llega del más reciente al más antiguo; el frontend no lo invierte a ciegas: ordena por
`timestamp` e `id`, y deduplica por `id`.

## Tiempo real e historial

No hay SSE ni WebSocket en el backend, así que el dashboard hace polling:

- Una sola petición por ciclo: `GET /api/measurements?from=<ahora - intervalo>&limit=500`.
  La última lectura sale del último elemento de esa misma respuesta.
- Intervalo de 5 s, sin solapamientos: la siguiente consulta se agenda cuando termina la anterior.
- Backoff exponencial (5 s → 30 s como máximo) si la API falla.
- Se pausa cuando la pestaña está oculta y se actualiza al volver.
- Cada petición se cancela con `AbortController` al desmontar; también hay timeout de 10 s.
- La serie se marca como **antigua** si pasan 60 s sin una respuesta exitosa
  (`STALE_AFTER_MS` en `src/config/qualityThresholds.ts`).

El historial ya guardado se ve en las gráficas del dashboard: cada lectura existente dentro del
intervalo es un punto de las líneas entrada/salida, y en cuanto el Collector inserta un registro
nuevo aparece en la siguiente consulta (máximo 5 s). El selector "Intervalo de las gráficas"
(5 min, 30 min, 1 h, 6 h, 24 h, 7 días) cambia la ventana en el momento.

Dos detalles honestos sobre los límites:

- Cada petición pide como máximo 500 registros (límite de la API). Si el intervalo contiene más, se
  muestran los 500 más recientes y el dashboard lo avisa.
- Si el intervalo no tiene ninguna lectura, el dashboard consulta `/api/measurements/latest` y te dice
  cuánto tiene la medición más reciente del sistema, para que amplíes el intervalo.

## Estándar de calidad (semáforos)

Los umbrales viven en `src/config/qualityThresholds.ts`. Cámbialos ahí y el dashboard, las gráficas y
la tabla se actualizan:

| Métrica | Verde (muy bueno) | Amarillo (normal) | Rojo (peligroso) |
| ------- | ----------------- | ----------------- | ----------------- |
| Temperatura | 18 – 26 °C | 14 – 30 °C | fuera de 14 – 30 °C |
| Humedad | 30 – 60 % | 20 – 70 % | fuera de 20 – 70 % |
| Gas MQ (crudo) | ≤ 300 | ≤ 600 | > 600 |

Notas:

- El gas usa la lectura cruda del sensor, sin conversión a ppm: los límites por defecto suponen una
  escala tipo ADC 0–4095 y deben ajustarse con los valores reales de tu ESP32.
- El estado general del sistema toma el peor resultado entre entrada y salida.
- Si no hay lectura o la señal está vieja, el semáforo queda en gris **"Sin datos"**: nunca se
  inventa un estado saludable cuando la API falla.
- Cada foquito muestra color, valor, estado y el motivo; el color nunca es la única señal.

## Rutas

- `/` — portada con QR.
- `/dashboard` — estado general, semáforos y gráficas del intervalo seleccionado (5 min a 7 días),
  actualizadas cada 5 s.
- `/historial` — tabla paginada con el mismo selector de intervalo (además de "Todo el historial").

## Despliegue

`vercel.json` incluye el rewrite SPA necesario para que `/dashboard` y `/historial` funcionen al
recargar. En Vercel:

1. Configura `VITE_API_BASE_URL=https://kiqtzal-backend.vercel.app/api` (o confía en el valor por
   defecto del código).
2. Despliega y abre `/dashboard`.
3. Verifica `https://kiqtzal-backend.vercel.app/api/health`.
