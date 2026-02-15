# AnálisisFútbol - Documentación Completa del Proyecto

Bienvenido a la documentación técnica de **AnálisisFútbol**, una plataforma avanzada de análisis de datos futbolísticos diseñada para proporcionar insights estratégicos y tendencias para apuestas deportivas.

---

## 🏗️ 1. Arquitectura del Proyecto

El proyecto sigue una arquitectura moderna de **Single Page Application (SPA)** desacoplada con un backend como servicio (BaaS).

-   **Frontend**: React.js (v18+) con Vite para un desarrollo ultrarápido.
-   **Backend/Base de Datos**: Supabase (PostgreSQL).
-   **Hosting**: Cloudflare Pages.
-   **Estilos**: Tailwind CSS con un sistema de diseño "Glassmorphism" oscuro y premium.

---

## 📂 2. Organización de Archivos

La estructura del proyecto está organizada de la siguiente manera:

```text
/
├── .env.local             # Variables de entorno (Supabase URL/Key)
├── index.html             # Punto de entrada HTML
├── package.json           # Dependencias y scripts de NPM
├── supabase_migration.sql # Esquema completo de la base de datos
├── vite.config.js         # Configuración de Vite y alias (@)
├── src/
│   ├── App.jsx            # Enrutador principal y proveedores de contexto
│   ├── main.jsx           # Punto de montaje de React
│   ├── components/        # Componentes reutilizables
│   │   ├── charts/        # Gráficos (GoalTime, CornerHalf, StatDistribution, etc.)
│   │   ├── layout/        # Navbar y envoltorios de diseño
│   │   ├── matches/       # Tarjetas de partido, formularios de edición y barras de stats
│   │   └── ui/            # Componentes base (Botones, Cards, Inputs)
│   ├── context/           # AuthContext (Manejo de sesión de Supabase)
│   ├── hooks/             # useMatches (Hooks de React Query para fetching de datos)
│   ├── lib/               # Clientes (Supabase, QueryClient, Parseaores CSV)
│   └── pages/             # Vistas principales (Dashboard, Matches, MatchDetail, etc.)
└── scripts/               # Scripts de utilidad (ej. actualización masiva de logos)
```

---

## 🗄️ 3. Base de Datos (Supabase)

El sistema utiliza **PostgreSQL** hospedado en Supabase. El archivo `supabase_migration.sql` contiene la definición exacta.

### Tablas Principales:
1.  **`teams`**: Almacena los equipos de La Liga.
    *   `id`, `name`, `short_name`, `logo_url`.
2.  **`matches`**: La tabla más importante con +40 columnas.
    *   **Identificación**: `id`, `season`, `matchday`, `match_date`.
    *   **Equipos**: `home_team_id`, `away_team_id` (FKs a `teams`).
    *   **Resultados**: `home_goals`, `away_goals`, `btts` (Both Teams to Score).
    *   **Stats Avanzadas**: xG (Expected Goals), posesión, tiros, córners (por mitades), tarjetas, faltas, etc.
    *   **Cuotas**: `home_odds`, `draw_odds`, `away_odds`.
    *   **Eventos**: `home_goal_minutes`, `away_goal_minutes` (almacenados como JSONB).

### Seguridad (RLS):
-   **Lectura**: Pública (Cualquier usuario puede ver los datos).
-   **Escritura**: Solo usuarios autenticados (Admin) pueden insertar o modificar datos a través del panel de importación o edición.

---

## 🚀 4. Funcionamiento de las Vistas

### 📊 Dashboard (Panel de Betting)
Es el corazón del proyecto. Calcula tendencias en tiempo real:
-   **Filtro de Temporada**: Sincronizado con la URL (`?season=...`).
-   **Betting Insights**: Lógica automatizada que analiza los partidos de la temporada y genera alertas como "Festival de Goles" si los partidos superan el 55% de Over 2.5.
-   **Gráficos**: Distribuciones de córners, faltas y tarjetas vs cuotas de apuestas.

### 📅 Partidos (Matches)
Lista completa de encuentros con filtros avanzados.
-   **Persistencia de Estado**: Utiliza `URLSearchParams`. Al navegar a un detalle y volver, se mantienen los filtros de temporada y jornada.
-   **Agrupación**: Los partidos se agrupan visualmente por Jornada (Matchday).

### 📝 Detalle y Edición (Match Detail)
-   Muestra el "Match Report" completo con xG, posesión y línea de tiempo de goles.
-   **Editor**: Permite a los administradores corregir datos o añadir minutos de goles manualmente. Limpia automáticamente inputs de texto para asegurar que los arrays JSONB sean correctos.

---

## 📥 5. Gestión de Datos (Data Import)

El archivo `src/pages/DataImport.jsx` permite subir archivos CSV.
1.  **Parsing**: Utiliza `src/lib/csvParser.js` para convertir el CSV (delimitado por `;`) en objetos JSON compatibles con Supabase.
2.  **Upsert**: Utiliza la lógica de `upsert` (Update or Insert). Si el ID del partido ya existe, lo actualiza; si no, lo crea.
3.  **Relaciones**: Convierte nombres de equipos en IDs de la tabla `teams`.

---

## ☁️ 6. Despliegue en Cloudflare Pages

El proyecto está configurado para despliegue continuo (CI/CD):
1.  **Vite Build**: Genera la carpeta `dist`.
2.  **Variables de Entorno**: Deben configurarse en el panel de Cloudflare:
    *   `VITE_SUPABASE_URL`
    *   `VITE_SUPABASE_ANON_KEY`
3.  **Routing**: El archivo `_redirects` (o la configuración de Single Page App) debe estar activo para que las rutas de React Router funcionen al recargar.

---

## 🛠️ 7. Cómo seguir mejorando el proyecto

1.  **Predicciones con IA**: Implementar un modelo que use `home_xg` y `away_xg` históricos para predecir el ganador de la siguiente jornada.
2.  **Comparativa Face-to-Face (H2H)**: En la página de detalle, añadir el historial de enfrentamientos entre ambos equipos.
3.  **Nuevas Ligas**: El sistema es agnóstico a la liga. Se podrían añadir temporadas de Premier League o Champions League simplemente cambiando la tabla de equipos y el campo `season`.
4.  **Actualización Real-time**: Usar Supabase Realtime para que los cambios en la DB se reflejen instantáneamente sin refrescar el Dashboard.

---

*Documentación generada el 15 de febrero de 2026.*
