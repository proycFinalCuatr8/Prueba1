const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const alumnoDB = require('./module/model');
const db = require('./module/db');
const apiRouter = require('./routes/api');
const cors = require('cors');
const PORT = process.env.PORT || 4000;

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use('/api', apiRouter);

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


app.get('/api/alumnos', async (req, res) => {
  try {
    const [alumnos] = await db.query('SELECT * FROM alumnos ORDER BY id DESC');
    res.json(alumnos); // 👉 devuelve JSON en lugar de renderizar EJS
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/upload', async (req, res) => {
  const { nombre, matricula, carrera } = req.body;

  if (!nombre || !matricula || !carrera) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    await db.query(
      'INSERT INTO alumnos (nombre, matricula, carrera) VALUES (?, ?, ?)',
      [nombre, matricula, carrera]
    );
    res.status(201).json({ mensaje: 'Alumno registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar alumno:', error);
    res.status(500).json({ error: 'Error al guardar en la base de datos' });
  }
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const filename = req.file.filename;
    await alumnoDB.insertarImagen(filename);
  } catch (err) {
    console.error('Error al subir imagen:', err);
    res.status(500).send('Error al subir imagen');
  }
});
app.get('/api/upload', (req, res) => {
  res.render('upload');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});