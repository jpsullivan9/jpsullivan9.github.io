// WIP//
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
  const { username, email, password } = req.body;
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(
      'INSERT INTO accounts(username, email, password_hash) VALUES($1, $2, $3) RETURNING user_id',
      [username, email, hashedPassword]
    );

    res.status(201).json({ userId: result.rows[0].user_id, message: "User successfully created." });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
};
