// WIP //
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query('SELECT user_id, password_hash FROM accounts WHERE email = $1', [email]);
    if (rows.length > 0) {
      const isValid = await bcrypt.compare(password, rows[0].password_hash);
      if (isValid) {
        res.status(200).json({ userId: rows[0].user_id, message: "Login successful." });
      } else {
        res.status(401).json({ error: "Invalid credentials." });
      }
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};
