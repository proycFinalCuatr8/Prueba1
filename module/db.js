// module/db.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'KevFu20ta',
  database: 'proyectofinal'
});

module.exports = db;
