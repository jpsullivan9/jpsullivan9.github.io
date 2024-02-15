const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = (req, res) => {
  const { q } = req.query;
  
  pool.query('SELECT * FROM products WHERE name ILIKE $1', [`%${q}%`], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Database query failed', details: error.message });
      return;
    }
    res.status(200).json(results.rows);
  });
};
