const { Pool } = require('pg');
const { getSuggestions } = require('../utils/fuseSetup');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  const { q, minPrice, maxPrice } = req.query;
  let queryParams = [`%${q}%`];
  let queryText = 'SELECT * FROM products WHERE name ILIKE $1';

  if (minPrice) {
    queryParams.push(minPrice);
    queryText += ` AND price >= $${queryParams.length}`;
  }

  if (maxPrice) {
    queryParams.push(maxPrice);
    queryText += ` AND price <= $${queryParams.length}`;
  }

  try {
    const results = await pool.query(queryText, queryParams);
    if (results.rows.length > 0) {
      res.status(200).json(results.rows);
    } else {
      // If no results, get suggestions
      const suggestions = await getSuggestions(q);
      res.json({ suggestions });
    }
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database query failed', details: error.message });
  }
};
