const express = require('express');
const router = express.Router();
const db = require('../module/db');
const alumnoDB = require('../module/model'); 

// Buscar imagen por ID
router.get('/buscar-id', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID requerido' });

  try {
    const [result] = await db.query('SELECT * FROM images WHERE id = ?', [id]);
    if (result.length === 0) return res.status(404).json({ error: 'No encontrada' });
    res.json(result[0]);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;

router.get('/api/buscar-alumno', async (req, res) => {
  const { campo, valor } = req.query;

  if (!campo || !valor) {
    return res.status(400).send('Faltan parámetros: campo y valor');
  }

  try {
    const [resultados] = await db.query(
      `SELECT * FROM alumnos WHERE ${campo} LIKE ?`,
      [`%${valor}%`]
    );
    const [images] = await db.query('SELECT * FROM images ORDER BY id DESC');

    res.render('index', {
      alumnoPorId: null,
      alumnosFiltrados: resultados,
      imagenPorId: null,
      images
    });
  } catch (error) {
    console.error('Error en /buscar-alumno:', error);
    res.status(500).send('Error al buscar alumnos');
  }
});

router.post('/alumnos', async (req, res) => {
  const { campo, valor } = req.body;

  if (!campo || !valor) {
    return res.status(400).send('Faltan parámetros: campo y valor');
  }

  try {
    const [resultados] = await db.query(
      `SELECT * FROM alumnos WHERE ${campo} LIKE ?`,
      [`%${valor}%`]
    );
    res.locals.alumnoPorId = null;
    res.locals.alumnosFiltrados = resultados;
    res.locals.imagenPorId = null;
    const [images] = await db.query('SELECT * FROM images ORDER BY id DESC');
    res.locals.images = images;
  } catch (error) {
    console.error('Error en /alumnos:', error);
    res.locals.alumnosFiltrados = [];
  }
  res.redirect('/');
});

router.post('/registrar-alumno', async (req, res) => {
  const { matricula, nombre, carrera, status } = req.body;
  const nuevoAlumno = {
    matricula,
    nombre,
    carrera,
    status: status === 'on' ? 1 : 0
  };

  try {
    await alumnoDB.insertar(nuevoAlumno);
    res.redirect('/');
  } catch (err) {
    console.error('Error al registrar alumno:', err);
    res.status(500).send('Error al guardar el alumno');
  }
  res.redirect('/');
});

module.exports = router;
