const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require('jsonwebtoken');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query('SELECT user_id, username, is_seller, password_hash FROM accounts WHERE email = $1', [email]);
    if (rows.length > 0) {
      const isValid = await bcrypt.compare(password, rows[0].password_hash);
      const tokenAuth = jwt.sign({ userId: rows[0].user_id, username: rows[0].username, isSeller: rows[0].is_seller}, 'superSecret', { expiresIn: '1h' });
      if (isValid) {
        res.status(200).json({ token: tokenAuth, message: "Login successful." });
      } else {
        res.status(401).json({ error: "Invalid credentials." });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};
