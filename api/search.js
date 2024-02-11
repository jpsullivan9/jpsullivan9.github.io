const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

module.exports = (req, res) => {
  const { q } = req.query;
  
  pool.query('SELECT * FROM products WHERE name LIKE ?', [`%${q}%`], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Database query failed' });
      return;
    }
    res.status(200).json(results);
  });
};