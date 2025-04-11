const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const alumnoDB = require('./module/model');
const db = require('./module/db');
const apiRouter = require('./routes/api');
const cors = require('cors');
const PORT = process.env.PORT || 4000;

// Configuraciones generales
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Multer para subir imágenes
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Ruta raíz para verificación simple
app.get('/', (req, res) => {
  res.send('<h1>Servidor corriendo correctamente</h1><p>Accede a /api para ver la API REST</p>');
});

// Rutas principales
app.use('/api', apiRouter);

// Página principal con render EJS
app.get('/api', async (req, res) => {
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

// Obtener alumnos
app.get('/api/alumnos', async (req, res) => {
  try {
    const [alumnos] = await db.query('SELECT * FROM alumnos ORDER BY id DESC');
    res.json(alumnos);
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Subir alumno (POST /api/upload)
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

// Subir imagen (POST /api/upload-image)
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    const filename = req.file.filename;
    await alumnoDB.insertarImagen(filename);
    res.status(200).json({ mensaje: 'Imagen subida correctamente' });
  } catch (err) {
    console.error('Error al subir imagen:', err);
    res.status(500).send('Error al subir imagen');
  }
});

// Página de subida de imagen
app.get('/api/upload', (req, res) => {
  res.render('upload');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});