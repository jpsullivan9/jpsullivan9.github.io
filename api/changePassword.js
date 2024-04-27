const { Pool } = require("pg");
const bcrypt = require('bcrypt');
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function changePasswordFunc(req, res) {
    const { email, oldPassword, newPassword } = req.body;
  
    try {
      const user = await pool.query(
        'SELECT * FROM accounts WHERE email = $1',
        [email]
      );
  
      if (user.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const hashedPassword = user.rows[0].password_hash;
  
      const isValid = await bcrypt.compare(oldPassword, hashedPassword);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid old password" });
      }
  
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
  
      await pool.query(
        'UPDATE accounts SET password_hash = $1 WHERE email = $2',
        [newHashedPassword, email]
      );
  
      return res.status(200).json({ message: "Password updated successfully" });
  
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({ error: "Failed to change password", details: error.message });
    }
  }
  
  module.exports = async (req, res) => {
    res = changePasswordFunc(req, res);
  };
  