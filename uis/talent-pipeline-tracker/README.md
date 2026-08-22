# Talent Pipeline Tracker

Aplicacion interna para Nexova Solutions (Operaciones de Seleccion) orientada al seguimiento de candidatos en un pipeline de reclutamiento.

## Funcionalidad principal

- Listado de candidatos con filtros por estado y etapa.
- Busqueda por nombre/email/cargo.
- Vista de detalle de candidato.
- Actualizacion de estado y etapa.
- Gestion de notas (listar, crear, eliminar).
- Alta y edicion de candidatos.

## Requisitos

- Node.js 20+
- npm

## Instalacion

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env.local` con:

```env
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
```

Tambien existe `.env.example` como referencia versionable.

## Desarrollo

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Validacion

```bash
npm run lint
npm run build
```
