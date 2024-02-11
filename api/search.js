const mysql = require('mysql');

// Create a pool connection to manage multiple connections
const pool = mysql.createPool({
  connectionLimit: 10, // The maximum number of connection requests the pool will queue before returning an error
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

module.exports = (req, res) => {
  const { q } = req.query;
  pool.query('SELECT * FROM products WHERE name LIKE ?', [`%${q}%`], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.status(200).json(results);
  });
};