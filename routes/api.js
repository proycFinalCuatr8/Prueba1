// ===== routes/api.js =====
const express = require('express');
const router = express.Router();
const db = require('../module/db');

// Buscar alumno por ID
router.get('/buscar-id', async (req, res) => {
  const id = req.query.id;
  try {
    const [alumnoResult] = await db.query('SELECT * FROM alumnos WHERE id = ?', [id]);
    const [images] = await db.query('SELECT * FROM images ORDER BY id DESC');
    res.render('index', {
      alumnoPorId: alumnoResult[0] || null,
      alumnosFiltrados: null,
      images
    });
  } catch (error) {
    console.error('Error en /api/buscar-id:', error);
    res.status(500).send('Error al buscar por ID');
  }
});

// Buscar alumno por cualquier campo
router.get('/buscar-general', async (req, res) => {
  const q = `%${req.query.q}%`;
  try {
    const [alumnosResult] = await db.query(
      `SELECT * FROM alumnos WHERE nombre LIKE ? OR carrera LIKE ? OR matricula LIKE ?`,
      [q, q, q]
    );
    const [images] = await db.query('SELECT * FROM images ORDER BY id DESC');
    res.render('index', {
      alumnoPorId: null,
      alumnosFiltrados: alumnosResult,
      images
    });
  } catch (error) {
    console.error('Error en /api/buscar-general:', error);
    res.status(500).send('Error al buscar alumno');
  }
});

module.exports = router;
