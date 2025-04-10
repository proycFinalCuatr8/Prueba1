const express = require('express');
const db = require('../module/db');
const router = express.Router();

// Obtener todas las imágenes
router.get('/images', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM images ORDER BY id DESC');
  res.json(rows);
});

// Obtener una imagen por ID
router.get('/images/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM images WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Imagen no encontrada' });
  res.json(rows[0]);
});

module.exports = router;
