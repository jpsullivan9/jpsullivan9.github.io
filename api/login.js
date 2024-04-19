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
async function loginFunc(req,res){
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query('SELECT user_id, username, is_seller, password_hash FROM accounts WHERE email = $1', [email]);
    if (rows.length > 0) {
        const user = rows[0];
      const isValid = await bcrypt.compare(password, user.password_hash);
      const tokenAuth = jwt.sign({ userId: user.user_id, username: user.username, isSeller: user.is_seller}, 'superSecret', { expiresIn: '1h' });
      if (isValid) {
        return res.status(200).json({ token: tokenAuth, username: user.username, message: "Login successful." });
      } else {
        return res.status(401).json({ error: "Invalid credentials." });
      }
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: "Login failed", details: error.message });
  }
}

module.exports = async (req, res) => {
  res = loginFunc(req,res);
};
