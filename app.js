const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const db = require('./module/db');
const apiRouter = require('./routes/api');

const PORT = process.env.PORT || 4000;

// Configurar motor de vistas y middlewares
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

// Configuración de multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Rutas desde api.js
app.use('/', apiRouter);

// Ruta base para mostrar galería inicial
app.get('/', async (req, res) => {
  const [images] = await db.query('SELECT * FROM images ORDER BY id DESC');
  res.render('index', {
    alumnoPorId: null,
    alumnosFiltrados: [],
    images
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
