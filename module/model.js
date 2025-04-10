// module/model.js
const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'KevFu20ta',
  database: 'proyectofinal'
});

conexion.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos proyectofinal');
});

const alumnoDB = {
  insertar: (alumno, funcionResultado) => {
    conexion.query('INSERT INTO alumnos SET ?', alumno, funcionResultado);
  },

  mostrarTodos: (funcionResultado) => {
    conexion.query('SELECT * FROM alumnos', funcionResultado);
  },

  buscarPorId: (id, funcionResultado) => {
    conexion.query('SELECT * FROM alumnos WHERE id = ?', [id], funcionResultado);
  },

  buscarPorMatricula: (matricula, funcionResultado) => {
    conexion.query('SELECT * FROM alumnos WHERE matricula = ?', [matricula], funcionResultado);
  },

  borrarPorId: (id, funcionResultado) => {
    conexion.query('DELETE FROM alumnos WHERE id = ?', [id], funcionResultado);
  },

  actualizarPorId: (id, alumno, funcionResultado) => {
    conexion.query('UPDATE alumnos SET ? WHERE id = ?', [alumno, id], funcionResultado);
  },

  cambiarStatus: (id, status, funcionResultado) => {
    conexion.query('UPDATE alumnos SET status = ? WHERE id = ?', [status, id], funcionResultado);
  },

  test: () => {
    const nuevoAlumno = {
      matricula: 'A12345',
      nombre: 'Ejemplo Alumno',
      carrera: 'ITI',
      status: true
    };

    alumnoDB.insertar(nuevoAlumno, (err, res) => {
      if (err) return console.error(err);
      console.log('Alumno insertado:', res.insertId);
    });

    alumnoDB.mostrarTodos((err, rows) => {
      if (err) return console.error(err);
      console.log('Todos los alumnos:', rows);
    });
  }
};

module.exports = alumnoDB;
