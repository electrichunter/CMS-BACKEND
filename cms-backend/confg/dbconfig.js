const mysql = require('mysql2/promise'); // Direkt Promise desteği

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1Aesd.cf',
  database: 'CMS',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Sorgu örneği (artık .promise() gerekmez)
// const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

module.exports = pool;