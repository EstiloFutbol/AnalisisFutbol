# ⚽ AnálisisFútbol

Una plataforma premium de análisis de datos futbolísticos diseñada para aficionados y apostadores que buscan una ventaja estadística.

![Dashboard Preview](https://github.com/EstiloFutbol/AnalisisFutbol/raw/main/public/preview.png)

## 🌟 Características

- **Dashboard Inteligente**: Insights automatizados sobre tendencias de goles (Over/Under), córners y tarjetas.
- **Base de Datos en Tiempo Real**: Sincronización completa con Supabase para datos de partidos y equipos.
- **Filtros Persistentes**: Navegación fluida que mantiene tus selecciones de temporada y jornada en el navegador.
- **Importación masiva**: Herramienta de carga CSV para actualizar miles de partidos en segundos.
- **Diseño Premium**: Interfaz oscura, moderna y totalmente adaptada a dispositivos móviles.

## 📚 Documentación

Para una guía detallada sobre la arquitectura del proyecto, la base de datos y cómo contribuir, consulta:
👉 **[DOCUMENTATION.md](./DOCUMENTATION.md)**

## 🚀 Inicio Rápido

### Requisitos previos
- Node.js (v18+)
- Una cuenta en Supabase.com
- Git

### Instalación local

1. **Clonar el repo**:
   ```bash
   git clone https://github.com/EstiloFutbol/AnalisisFutbol.git
   cd AnalisisFutbol
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Variables de Entorno**:
   Crea un archivo `.env.local` con tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   ```

4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack

- **React + Vite**
- **Supabase** (PostgreSQL + Auth + Storage)
- **Tailwind CSS**
- **React Query**
- **Framer Motion** & **Recharts**

---
Desarrollado con ❤️ para el análisis del fútbol.
