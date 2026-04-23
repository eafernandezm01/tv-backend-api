# Backend Node.js - CRUD contenido plataformas TV

API REST hecha con **Node.js + Express + SQLite** para usar desde Angular.

## Qué incluye
- CRUD completo


## Instalación

```bash
npm install
npm start
```

Servidor:
```bash
http://localhost:3000
```

## Endpoints

### Obtener todos
```http
GET /api/content
```

### Filtros opcionales
```http
GET /api/content?type=serie
GET /api/content?platform=Netflix
GET /api/content?title=Dark
GET /api/content?type=serie&platform=Netflix
```

### Obtener uno por id
```http
GET /api/content/:id
```

### Crear
```http
POST /api/content
Content-Type: application/json
```

Body:
```json
{
  "title": "Stranger Things",
  "genre": "Ciencia ficción",
  "platform": "Netflix",
  "year": 2016,
  "type": "serie",
  "image": "https://ejemplo.com/stranger-things.jpg"
}
```

### Actualizar
```http
PUT /api/content/:id
Content-Type: application/json
```

### Eliminar
```http
DELETE /api/content/:id
```

## Estructura de un registro
```json
{
  "id": 1,
  "title": "Breaking Bad",
  "genre": "Drama",
  "platform": "Netflix",
  "year": 2008,
  "type": "serie",
  "image": "https://..."
}
```
