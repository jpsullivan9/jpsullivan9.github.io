const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = (req, res) => {
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

  pool.query(queryText, queryParams, (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Database query failed', details: error.message });
      return;
    }
    res.status(200).json(results.rows);
  });
};
