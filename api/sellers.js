const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

const fetchSellers = async (req, res) => {
  try {
      const { rows } = await pool.query('SELECT user_id, username FROM accounts WHERE is_seller = true');
      res.status(200).json(rows);
  } catch (error) {
      console.error('Failed to fetch sellers:', error);
      res.status(500).json({ message: 'Failed to fetch sellers' });
  }
};

module.exports = fetchSellers;