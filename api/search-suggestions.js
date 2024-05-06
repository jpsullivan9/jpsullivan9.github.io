const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

const getSuggestions = async (req, res) => {
  const { q } = req.query;
  try {
    const queryText = `SELECT name FROM products WHERE name ILIKE $1 LIMIT 10;`;
    const queryParams = [`%${q}%`];
    const { rows } = await pool.query(queryText, queryParams);
    const suggestions = rows.map(row => row.name);

    if (rows.length === 0) {
      res.status(404).json(suggestions);
    } else {
      res.status(200).json(suggestions);
    }
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    res.status(500).json({ message: 'Failed to fetch search suggestions' });
  }
};

module.exports = getSuggestions;
