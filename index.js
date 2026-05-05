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

  db.run(`
    CREATE TABLE IF NOT EXISTS content_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_id INTEGER NOT NULL UNIQUE,
      synopsis TEXT,
      duration INTEGER,
      seasons INTEGER,
      episodes INTEGER,
      director TEXT,
      cast TEXT,
      rating REAL,
      trailer TEXT,
      FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
    )
  `);

  seedDatabase();
});

function seedDatabase() {
  const platforms = ['Netflix', 'HBO Max', 'Prime Video', 'Disney+'];
  const types = ['pelicula', 'serie', 'documental'];
  const genres = [
    'Drama',
    'Thriller',
    'Crimen',
    'Ciencia ficción',
    'Fantasía',
    'Acción',
    'Aventura',
    'Naturaleza',
    'Tecnología',
    'Romance',
    'Histórica'
  ];

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
      {
        title: 'Breaking Bad',
        year: 2008,
        image: 'https://placehold.co/300x450?text=Breaking+Bad',
        platform: 'Netflix',
        type: 'serie',
        genre: 'Drama',
        details: {
          synopsis: 'Un profesor de química comienza a fabricar metanfetamina tras recibir un diagnóstico de cáncer.',
          duration: null,
          seasons: 5,
          episodes: 62,
          director: 'Vince Gilligan',
          cast: 'Bryan Cranston, Aaron Paul, Anna Gunn',
          rating: 9.5,
          trailer: 'https://www.youtube.com/results?search_query=Breaking+Bad+trailer'
        }
      },
      {
        title: 'Dexter',
        year: 2006,
        image: 'https://placehold.co/300x450?text=Dexter',
        platform: 'Netflix',
        type: 'serie',
        genre: 'Crimen',
        details: {
          synopsis: 'Dexter Morgan trabaja como forense en Miami, pero oculta una doble vida como asesino en serie.',
          duration: null,
          seasons: 8,
          episodes: 96,
          director: 'James Manos Jr.',
          cast: 'Michael C. Hall, Jennifer Carpenter',
          rating: 8.6,
          trailer: 'https://www.youtube.com/results?search_query=Dexter+trailer'
        }
      },
      {
        title: 'Stranger Things',
        year: 2016,
        image: 'https://placehold.co/300x450?text=Stranger+Things',
        platform: 'Netflix',
        type: 'serie',
        genre: 'Ciencia ficción',
        details: {
          synopsis: 'Un grupo de niños descubre fuerzas sobrenaturales y secretos del gobierno en su pequeño pueblo.',
          duration: null,
          seasons: 4,
          episodes: 34,
          director: 'The Duffer Brothers',
          cast: 'Millie Bobby Brown, Finn Wolfhard, David Harbour',
          rating: 8.7,
          trailer: 'https://www.youtube.com/results?search_query=Stranger+Things+trailer'
        }
      },
      {
        title: 'Interstellar',
        year: 2014,
        image: 'https://placehold.co/300x450?text=Interstellar',
        platform: 'Prime Video',
        type: 'pelicula',
        genre: 'Ciencia ficción',
        details: {
          synopsis: 'Un grupo de astronautas viaja a través de un agujero de gusano para buscar un nuevo hogar para la humanidad.',
          duration: 169,
          seasons: null,
          episodes: null,
          director: 'Christopher Nolan',
          cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
          rating: 8.7,
          trailer: 'https://www.youtube.com/results?search_query=Interstellar+trailer'
        }
      },
      {
        title: 'Inception',
        year: 2010,
        image: 'https://placehold.co/300x450?text=Inception',
        platform: 'HBO Max',
        type: 'pelicula',
        genre: 'Ciencia ficción',
        details: {
          synopsis: 'Un ladrón especializado en robar secretos dentro de los sueños recibe una misión casi imposible.',
          duration: 148,
          seasons: null,
          episodes: null,
          director: 'Christopher Nolan',
          cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
          rating: 8.8,
          trailer: 'https://www.youtube.com/results?search_query=Inception+trailer'
        }
      },
      {
        title: 'Avatar',
        year: 2009,
        image: 'https://placehold.co/300x450?text=Avatar',
        platform: 'Disney+',
        type: 'pelicula',
        genre: 'Aventura',
        details: {
          synopsis: 'Un exmarine viaja al planeta Pandora y se ve atrapado entre su misión y el mundo de los Na’vi.',
          duration: 162,
          seasons: null,
          episodes: null,
          director: 'James Cameron',
          cast: 'Sam Worthington, Zoe Saldaña, Sigourney Weaver',
          rating: 7.9,
          trailer: 'https://www.youtube.com/results?search_query=Avatar+trailer'
        }
      },
      {
        title: 'Our Planet',
        year: 2019,
        image: 'https://placehold.co/300x450?text=Our+Planet',
        platform: 'Netflix',
        type: 'documental',
        genre: 'Naturaleza',
        details: {
          synopsis: 'Documental sobre la belleza natural del planeta y el impacto del ser humano en los ecosistemas.',
          duration: null,
          seasons: 1,
          episodes: 8,
          director: 'Alastair Fothergill',
          cast: 'David Attenborough',
          rating: 9.3,
          trailer: 'https://www.youtube.com/results?search_query=Our+Planet+trailer'
        }
      }
    ];

    sampleData.forEach(item => {
      db.get(
        `SELECT p.id AS platform_id, t.id AS type_id, g.id AS genre_id
         FROM platforms p, types t, genres g
         WHERE p.name = ? AND t.name = ? AND g.name = ?`,
        [item.platform, item.type, item.genre],
        (err2, ids) => {
          if (err2 || !ids) {
            return console.error(err2?.message || 'IDs no encontrados');
          }

          db.run(
            `INSERT INTO content 
             (title, year, image, platform_id, type_id, genre_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              item.title,
              item.year,
              item.image,
              ids.platform_id,
              ids.type_id,
              ids.genre_id
            ],
            function (insertErr) {
              if (insertErr) return console.error(insertErr.message);

              db.run(
                `INSERT OR IGNORE INTO content_details
                 (content_id, synopsis, duration, seasons, episodes, director, cast, rating, trailer)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  this.lastID,
                  item.details.synopsis,
                  item.details.duration,
                  item.details.seasons,
                  item.details.episodes,
                  item.details.director,
                  item.details.cast,
                  item.details.rating,
                  item.details.trailer
                ]
              );
            }
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
            g.id AS genre_id, g.name AS genre,
            d.synopsis,
            d.duration,
            d.seasons,
            d.episodes,
            d.director,
            d.cast,
            d.rating,
            d.trailer
     FROM content c
     JOIN platforms p ON c.platform_id = p.id
     JOIN types t ON c.type_id = t.id
     JOIN genres g ON c.genre_id = g.id
     LEFT JOIN content_details d ON d.content_id = c.id
     WHERE c.id = ?`,
    [id],
    callback
  );
}

function validateContent(body, callback) {
  const { title, year, platform_id, type_id, genre_id } = body;

  if (!title || !year || !platform_id || !type_id || !genre_id) {
    return callback('Los campos title, year, platform_id, type_id y genre_id son obligatorios.');
  }

  if (isNaN(Number(year))) {
    return callback('El campo year debe ser numérico.');
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
      contentDetail: '/api/content/:id',
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
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const {
      title,
      year,
      image,
      platform_id,
      type_id,
      genre_id,
      synopsis,
      duration,
      seasons,
      episodes,
      director,
      cast,
      rating,
      trailer
    } = req.body;

    db.run(
      `INSERT INTO content 
       (title, year, image, platform_id, type_id, genre_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, Number(year), image || null, platform_id, type_id, genre_id],
      function (err) {
        if (err) return res.status(500).json({ error: 'Error al crear el contenido.' });

        const contentId = this.lastID;

        db.run(
          `INSERT INTO content_details
           (content_id, synopsis, duration, seasons, episodes, director, cast, rating, trailer)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            contentId,
            synopsis || null,
            duration || null,
            seasons || null,
            episodes || null,
            director || null,
            cast || null,
            rating || null,
            trailer || null
          ],
          detailErr => {
            if (detailErr) {
              return res.status(500).json({ error: 'Contenido creado, pero error al guardar detalles.' });
            }

            selectContentById(contentId, (readErr, row) => {
              if (readErr) {
                return res.status(500).json({ error: 'Creado, pero no se pudo recuperar.' });
              }

              res.status(201).json(row);
            });
          }
        );
      }
    );
  });
});

app.put('/api/content/:id', (req, res) => {
  validateContent(req.body, validationError => {
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const {
      title,
      year,
      image,
      platform_id,
      type_id,
      genre_id,
      synopsis,
      duration,
      seasons,
      episodes,
      director,
      cast,
      rating,
      trailer
    } = req.body;

    db.run(
      `UPDATE content
       SET title = ?, year = ?, image = ?, platform_id = ?, type_id = ?, genre_id = ?
       WHERE id = ?`,
      [title, Number(year), image || null, platform_id, type_id, genre_id, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: 'Error al actualizar el contenido.' });
        if (this.changes === 0) return res.status(404).json({ error: 'Contenido no encontrado.' });

        db.run(
          `INSERT INTO content_details
           (content_id, synopsis, duration, seasons, episodes, director, cast, rating, trailer)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(content_id) DO UPDATE SET
             synopsis = excluded.synopsis,
             duration = excluded.duration,
             seasons = excluded.seasons,
             episodes = excluded.episodes,
             director = excluded.director,
             cast = excluded.cast,
             rating = excluded.rating,
             trailer = excluded.trailer`,
          [
            req.params.id,
            synopsis || null,
            duration || null,
            seasons || null,
            episodes || null,
            director || null,
            cast || null,
            rating || null,
            trailer || null
          ],
          detailErr => {
            if (detailErr) {
              return res.status(500).json({ error: 'Contenido actualizado, pero error al actualizar detalles.' });
            }

            selectContentById(req.params.id, (readErr, row) => {
              if (readErr) {
                return res.status(500).json({ error: 'Actualizado, pero no se pudo recuperar.' });
              }

              res.json(row);
            });
          }
        );
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