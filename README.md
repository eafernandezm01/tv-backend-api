# Backend Node.js - CRUD contenido plataformas TV

API REST desarrollada con **Node.js + Express + SQLite** para gestionar contenido de plataformas de streaming.

## Qué incluye
- CRUD completo de contenidos
- Tablas relacionadas: `platforms`, `types`, `genres`
- Claves foráneas en la tabla `content`
- Datos iniciales automáticos
- Endpoints auxiliares para Angular

## Instalación

```bash
npm install
npm start
```

Servidor:
```bash
http://localhost:3000
```

## Importante

Si vienes de una versión anterior, borra antes el archivo:

```bash
database.db
```

Luego arranca de nuevo:

```bash
npm start
```

## Endpoints

```http
GET /
GET /api/content
GET /api/content?platform_id=1
GET /api/content?type_id=2
GET /api/content?genre_id=3
GET /api/content?title=Dark
GET /api/content/:id
POST /api/content
PUT /api/content/:id
DELETE /api/content/:id
GET /api/platforms
GET /api/types
GET /api/genres
```

## Crear contenido

```json
{
  "title": "Stranger Things",
  "year": 2016,
  "image": "https://ejemplo.com/stranger-things.jpg",
  "platform_id": 1,
  "type_id": 2,
  "genre_id": 4
}
```

## Estructura de un registro

```json
{
  "id": 1,
  "title": "Breaking Bad",
  "year": 2008,
  "image": "https://...",
  "platform_id": 1,
  "platform": "Netflix",
  "type_id": 2,
  "type": "serie",
  "genre_id": 1,
  "genre": "Drama"
}
```
