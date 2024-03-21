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
      const allProducts = await pool.query('SELECT name, price FROM products');
      const filteredProducts = allProducts.rows.filter(product => {
        const price = parseFloat(product.price);
        return (!minPrice || price >= parseFloat(minPrice)) && (!maxPrice || price <= parseFloat(maxPrice));
      });
      const suggestions = await getSuggestions(q, filteredProducts.map(product => product.name));
      res.json({ suggestions });
    }
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database query failed', details: error.message });
  }
};
