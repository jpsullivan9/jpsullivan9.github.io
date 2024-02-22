const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      // Fetch a single product by ID
      const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } else {
      // Fetch only featured products
      const { rows } = await pool.query('SELECT * FROM products WHERE featured = true');

      res.status(200).json(rows);
    }
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database query failed', details: error.message });
  }
};
