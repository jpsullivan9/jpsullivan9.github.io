const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Vercel automatically sets this env variable
  ssl: {
    rejectUnauthorized: false // Necessary if your DB requires SSL and you're using a self-signed certificate
  }
});

module.exports = (req, res) => {
  const { q } = req.query;
  
  pool.query('SELECT * FROM products WHERE name ILIKE $1', [`%${q}%`], (error, results) => {
    if (error) {
      console.error('Database query error:', error); // Log the specific error to the console
      res.status(500).json({ error: 'Database query failed', details: error.message });
      return;
    }
    res.status(200).json(results.rows);
  });
};
