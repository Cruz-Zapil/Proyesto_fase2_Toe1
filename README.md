# Syshub - Fase 2: Implementación y Desarrollo

## 📦 Estructura del Proyecto

```
syshub/
├── backend/                # NestJS API
├── frontend/               # Vue.js 3 + Tailwind
├── database/              # PostgreSQL migrations
├── docker/                # Dockerfiles
├── docker-compose.yml     # Dev environment
├── README.md
└── .gitignore
```

## 🚀 Inicio Rápido

### Requisitos Previos
- Docker y Docker Compose 2.0+
- Node.js 18+ (para desarrollo local)
- PostgreSQL 14+ (si ejecutas sin Docker)

### Ejecutar en Docker

```bash
cd /path/to/syshub
docker-compose up -d
```

La aplicación estará disponible en:
- 🌐 Frontend: http://localhost:5173
- 🔌 Backend API: http://localhost:3000
- 📊 PostgreSQL: localhost:5432

### Desarrollo Local

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

## 📋 Módulos Implementados

- ✅ **Identidad y Perfiles** - Auth JWT + Roles
- ✅ **Repositorio de Proyectos** - The Hub
- ✅ **Foros y Social** - Sys-Reddit
- ✅ **Administración y Moderación** - Panel Admin

## 🔐 Variables de Entorno

Ver `.env.example` en cada carpeta (backend/frontend).

## 📚 Documentación

- [Backend API Docs](./backend/README.md)
- [Frontend Setup](./frontend/README.md)
- [Database Schema](./database/README.md)

## 📅 Entrega

**Fecha límite:** 27 de abril de 2026

## 👥 Equipo

Centro Universitario de Occidente - USAC
Teoría de Sistemas 1 - Primer Semestre 2026
