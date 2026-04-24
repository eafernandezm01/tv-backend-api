const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS platforms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS genres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      year INTEGER NOT NULL,
      image TEXT,
      platform_id INTEGER NOT NULL,
      type_id INTEGER NOT NULL,
      genre_id INTEGER NOT NULL,
      FOREIGN KEY (platform_id) REFERENCES platforms(id),
      FOREIGN KEY (type_id) REFERENCES types(id),
      FOREIGN KEY (genre_id) REFERENCES genres(id)
    )
  `);

  seedDatabase();
});

function seedDatabase() {
  const platforms = ['Netflix', 'HBO Max', 'Prime Video', 'Disney+'];
  const types = ['pelicula', 'serie', 'documental'];
  const genres = ['Drama', 'Thriller', 'Crimen', 'Ciencia ficción', 'Fantasía', 'Acción', 'Aventura', 'Naturaleza', 'Tecnología', 'Romance', 'Histórica'];

  platforms.forEach(name => {
    db.run('INSERT OR IGNORE INTO platforms (name) VALUES (?)', [name]);
  });

  types.forEach(name => {
    db.run('INSERT OR IGNORE INTO types (name) VALUES (?)', [name]);
  });

  genres.forEach(name => {
    db.run('INSERT OR IGNORE INTO genres (name) VALUES (?)', [name]);
  });

  db.get('SELECT COUNT(*) AS total FROM content', [], (err, row) => {
    if (err) return console.error(err.message);
    if (row.total > 0) return;

    const sampleData = [
      { title: 'Breaking Bad', year: 2008, image: 'https://upload.wikimedia.org/wikipedia/en/6/61/Breaking_Bad_title_card.png', platform: 'Netflix', type: 'serie', genre: 'Drama' },
      { title: 'You', year: 2018, image: 'https://upload.wikimedia.org/wikipedia/en/8/8f/You_%28TV_series%29.png', platform: 'Netflix', type: 'serie', genre: 'Thriller' },
      { title: 'Dexter', year: 2006, image: 'https://upload.wikimedia.org/wikipedia/en/c/c0/Dexter_TV_series.jpg', platform: 'Netflix', type: 'serie', genre: 'Crimen' },
      { title: 'Stranger Things', year: 2016, image: 'https://upload.wikimedia.org/wikipedia/en/f/f7/Stranger_Things_season_4.jpg', platform: 'Netflix', type: 'serie', genre: 'Ciencia ficción' },
      { title: 'The Witcher', year: 2019, image: 'https://upload.wikimedia.org/wikipedia/en/1/1f/The_Witcher_title_card.png', platform: 'Netflix', type: 'serie', genre: 'Fantasía' },
      { title: 'Interstellar', year: 2014, image: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg', platform: 'Prime Video', type: 'pelicula', genre: 'Ciencia ficción' },
      { title: 'Inception', year: 2010, image: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Inception_ver3.jpg', platform: 'HBO Max', type: 'pelicula', genre: 'Ciencia ficción' },
      { title: 'Avatar', year: 2009, image: 'https://upload.wikimedia.org/wikipedia/en/d/d6/Avatar_%282009_film%29_poster.jpg', platform: 'Disney+', type: 'pelicula', genre: 'Aventura' },
      { title: 'The Dark Knight', year: 2008, image: 'https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg', platform: 'HBO Max', type: 'pelicula', genre: 'Acción' },
      { title: 'Titanic', year: 1997, image: 'https://upload.wikimedia.org/wikipedia/en/2/22/Titanic_poster.jpg', platform: 'Disney+', type: 'pelicula', genre: 'Romance' },
      { title: 'Gladiator', year: 2000, image: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Gladiator_ver1.jpg', platform: 'Netflix', type: 'pelicula', genre: 'Histórica' },
      { title: 'Our Planet', year: 2019, image: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Our_Planet_title_card.jpg', platform: 'Netflix', type: 'documental', genre: 'Naturaleza' },
      { title: 'The Social Dilemma', year: 2020, image: 'https://upload.wikimedia.org/wikipedia/en/9/97/The_Social_Dilemma_poster.png', platform: 'Netflix', type: 'documental', genre: 'Tecnología' }
    ];

    sampleData.forEach(item => {
      db.get(
        `SELECT p.id AS platform_id, t.id AS type_id, g.id AS genre_id
         FROM platforms p, types t, genres g
         WHERE p.name = ? AND t.name = ? AND g.name = ?`,
        [item.platform, item.type, item.genre],
        (err2, ids) => {
          if (err2 || !ids) return console.error(err2?.message || 'IDs no encontrados');

          db.run(
            `INSERT INTO content (title, year, image, platform_id, type_id, genre_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [item.title, item.year, item.image, ids.platform_id, ids.type_id, ids.genre_id]
          );
        }
      );
    });
  });
}

function selectContentById(id, callback) {
  db.get(
    `SELECT c.id, c.title, c.year, c.image,
            p.id AS platform_id, p.name AS platform,
            t.id AS type_id, t.name AS type,
            g.id AS genre_id, g.name AS genre
     FROM content c
     JOIN platforms p ON c.platform_id = p.id
     JOIN types t ON c.type_id = t.id
     JOIN genres g ON c.genre_id = g.id
     WHERE c.id = ?`,
    [id],
    callback
  );
}

function validateContent(body, callback) {
  const { title, year, image, platform_id, type_id, genre_id } = body;

  if (!title || !year || !platform_id || !type_id || !genre_id) {
    return callback('Los campos title, year, platform_id, type_id y genre_id son obligatorios.');
  }

  if (isNaN(Number(year))) {
    return callback('El campo year debe ser numérico.');
  }

  if (image && typeof image !== 'string') {
    return callback('El campo image debe ser texto.');
  }

  db.get('SELECT id FROM platforms WHERE id = ?', [platform_id], (err, platformRow) => {
    if (err) return callback('Error validando platform_id.');
    if (!platformRow) return callback('La plataforma indicada no existe.');

    db.get('SELECT id FROM types WHERE id = ?', [type_id], (err2, typeRow) => {
      if (err2) return callback('Error validando type_id.');
      if (!typeRow) return callback('El tipo indicado no existe.');

      db.get('SELECT id FROM genres WHERE id = ?', [genre_id], (err3, genreRow) => {
        if (err3) return callback('Error validando genre_id.');
        if (!genreRow) return callback('El género indicado no existe.');
        callback(null);
      });
    });
  });
}

app.get('/', (req, res) => {
  res.json({
    message: 'API TV funcionando',
    endpoints: {
      content: '/api/content',
      platforms: '/api/platforms',
      types: '/api/types',
      genres: '/api/genres'
    }
  });
});

app.get('/api/content', (req, res) => {
  const { platform_id, type_id, genre_id, title } = req.query;

  let sql = `
    SELECT c.id, c.title, c.year, c.image,
           p.id AS platform_id, p.name AS platform,
           t.id AS type_id, t.name AS type,
           g.id AS genre_id, g.name AS genre
    FROM content c
    JOIN platforms p ON c.platform_id = p.id
    JOIN types t ON c.type_id = t.id
    JOIN genres g ON c.genre_id = g.id
    WHERE 1=1
  `;

  const params = [];

  if (platform_id) {
    sql += ' AND c.platform_id = ?';
    params.push(platform_id);
  }

  if (type_id) {
    sql += ' AND c.type_id = ?';
    params.push(type_id);
  }

  if (genre_id) {
    sql += ' AND c.genre_id = ?';
    params.push(genre_id);
  }

  if (title) {
    sql += ' AND c.title LIKE ?';
    params.push(`%${title}%`);
  }

  sql += ' ORDER BY c.id DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error al obtener contenidos:', err.message);
      return res.status(500).json({ error: 'Error al obtener contenidos.' });
    }

    res.json(rows);
  });
});

app.get('/api/content/:id', (req, res) => {
  selectContentById(req.params.id, (err, row) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el contenido.' });
    if (!row) return res.status(404).json({ error: 'Contenido no encontrado.' });
    res.json(row);
  });
});

app.post('/api/content', (req, res) => {
  validateContent(req.body, validationError => {
    if (validationError) return res.status(400).json({ error: validationError });

    const { title, year, image, platform_id, type_id, genre_id } = req.body;

    db.run(
      `INSERT INTO content (title, year, image, platform_id, type_id, genre_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, Number(year), image || null, platform_id, type_id, genre_id],
      function (err) {
        if (err) return res.status(500).json({ error: 'Error al crear el contenido.' });

        selectContentById(this.lastID, (readErr, row) => {
          if (readErr) return res.status(500).json({ error: 'Creado, pero no se pudo recuperar.' });
          res.status(201).json(row);
        });
      }
    );
  });
});

app.put('/api/content/:id', (req, res) => {
  validateContent(req.body, validationError => {
    if (validationError) return res.status(400).json({ error: validationError });

    const { title, year, image, platform_id, type_id, genre_id } = req.body;

    db.run(
      `UPDATE content
       SET title = ?, year = ?, image = ?, platform_id = ?, type_id = ?, genre_id = ?
       WHERE id = ?`,
      [title, Number(year), image || null, platform_id, type_id, genre_id, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: 'Error al actualizar el contenido.' });
        if (this.changes === 0) return res.status(404).json({ error: 'Contenido no encontrado.' });

        selectContentById(req.params.id, (readErr, row) => {
          if (readErr) return res.status(500).json({ error: 'Actualizado, pero no se pudo recuperar.' });
          res.json(row);
        });
      }
    );
  });
});

app.delete('/api/content/:id', (req, res) => {
  db.run('DELETE FROM content WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: 'Error al eliminar el contenido.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Contenido no encontrado.' });
    res.json({ message: 'Contenido eliminado correctamente.' });
  });
});

app.get('/api/platforms', (req, res) => {
  db.all('SELECT id, name FROM platforms ORDER BY name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener plataformas.' });
    res.json(rows);
  });
});

app.get('/api/types', (req, res) => {
  db.all('SELECT id, name FROM types ORDER BY name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener tipos.' });
    res.json(rows);
  });
});

app.get('/api/genres', (req, res) => {
  db.all('SELECT id, name FROM genres ORDER BY name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener géneros.' });
    res.json(rows);
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
