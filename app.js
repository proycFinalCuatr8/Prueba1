const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Configuraciones
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Rutas
app.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM images ORDER BY id DESC');
  res.render('index', { images: rows });
});

app.get('/upload', (req, res) => {
  res.render('upload');
});

app.post('/upload', upload.single('image'), async (req, res) => {
  await db.query('INSERT INTO images (filename) VALUES (?)', [req.file.filename]);
  res.redirect('/');
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
