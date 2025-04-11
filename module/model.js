// module/model.js
const mysql = require('mysql2/promise');

let conexion;

(async () => {
  try {
    conexion = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'KevFu20ta',
      database: 'proyectofinal'
    });
    console.log('Conectado a la base de datos proyectofinal');
  } catch (err) {
    console.error('Error de conexión a la base de datos:', err);
  }
})();

const alumnoDB = {
  insertar: async (alumno) => {
    try {
      const [result] = await conexion.query('INSERT INTO alumnos SET ?', alumno);
      return result;
    } catch (err) {
      throw err;
    }
  },

  insertarImagen: (nombreArchivo) => {
    return new Promise((resolve, reject) => {
      conexion.query('INSERT INTO images (filename) VALUES (?)', [nombreArchivo], (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  },

  mostrarTodos: async () => {
    const [rows] = await conexion.query('SELECT * FROM alumnos');
    return rows;
  },

  buscarPorId: async (id) => {
    const [rows] = await conexion.query('SELECT * FROM alumnos WHERE id = ?', [id]);
    return rows;
  },

  buscarPorMatricula: async (matricula) => {
    const [rows] = await conexion.query('SELECT * FROM alumnos WHERE matricula = ?', [matricula]);
    return rows;
  },

  borrarPorId: async (id) => {
    const [result] = await conexion.query('DELETE FROM alumnos WHERE id = ?', [id]);
    return result;
  },

  actualizarPorId: async (id, alumno) => {
    const [result] = await conexion.query('UPDATE alumnos SET ? WHERE id = ?', [alumno, id]);
    return result;
  },

  cambiarStatus: async (id, status) => {
    const [result] = await conexion.query('UPDATE alumnos SET status = ? WHERE id = ?', [status, id]);
    return result;
  },

  test: async () => {
    const nuevoAlumno = {
      matricula: 'A12345',
      nombre: 'kevin',
      carrera: 'ITI',
      status: true
    };

    try {
      const res = await alumnoDB.insertar(nuevoAlumno);
      console.log('Alumno insertado:', res.insertId);

      const rows = await alumnoDB.mostrarTodos();
      console.log('Todos los alumnos:', rows);
    } catch (err) {
      console.error(err);
    }
  }
};

module.exports = alumnoDB;