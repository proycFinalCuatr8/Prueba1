const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const alumnoDB = require('./module/model');
const db = require('./module/db');
const apiRouter = require('./routes/api.js');
const PORT = process.env.PORT || 4000;


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
app.use('/', apiRouter);

app.get('/', async (req, res) => {
  try {
    const [images] = await db.query('SELECT * FROM images ORDER BY id DESC');
    const [alumnos] = await db.query('SELECT * FROM alumnos ORDER BY id DESC');
    res.render('index', {
      alumnoPorId: null,
      alumnosFiltrados: [],
      imagenPorId: null,
      images,
      alumnos
    });
  } catch (error) {
    console.error('Error al cargar la vista principal:', error);
    res.status(500).send('Error al cargar la página');
  }
});


app.get('/alumnos', async (req, res) => {
  const [images] = await db.query('SELECT * FROM images ORDER BY id DESC');
  res.render('alumnos', {
    alumnoPorId: null,
    alumnosFiltrados: [],
    imagenPorId: null,
    images
  });
});
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const filename = req.file.filename;
    await alumnoDB.insertarImagen(filename);
  } catch (err) {
    console.error('Error al subir imagen:', err);
    res.status(500).send('Error al subir imagen');
  }
});
app.get('/upload', (req, res) => {
  res.render('upload');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});