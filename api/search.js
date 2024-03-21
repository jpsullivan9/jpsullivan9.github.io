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
  const { q, minPrice, maxPrice, minRating, sellerIds } = req.query;
  let queryParams = [`%${q}%`];
  let queryConditions = ["SIMILARITY(name, $1) > 0.3"]; // adjustable query threshold

  if (minPrice) {
    queryParams.push(minPrice);
    queryConditions.push(`price >= $${queryParams.length}`);
  }

  if (maxPrice) {
    queryParams.push(maxPrice);
    queryConditions.push(`price <= $${queryParams.length}`);
  }

  if (minRating) {
    queryParams.push(minRating);
    queryConditions.push(`average_review_score >= $${queryParams.length}`);
  }

  if (sellerIds) {
    const sellerIdArray = sellerIds.split(',').map(id => parseInt(id, 10));
    queryParams.push(sellerIdArray);
    queryConditions.push(`seller_id = ANY($${queryParams.length}::int[])`);
  }

  let queryText = `SELECT *, SIMILARITY(name, $1) AS sml FROM products WHERE ${queryConditions.join(' AND ')} ORDER BY sml DESC`;

  try {
    const results = await pool.query(queryText, queryParams);
    if (results.rows.length > 0) {
      res.status(200).json(results.rows);
    } else if (minPrice || maxPrice || minRating || sellerIds) {
      res.json({ message: "No products found. Consider adjusting filters." });
    }
    else {
      const suggestions = await getSuggestions(q);
      res.json({ suggestions });
    }
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database query failed', details: error.message });
  }
};
