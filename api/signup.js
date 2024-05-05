const { Pool } = require("pg");
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function signupFunc(req, res) {
  const { username, email, password, phone, isSeller } = req.body;
  const saltRounds = 10;
  const reqUniqueField = [username,email,phone];
  const reqUniqueName = ['username', 'email', 'phone_number'];
  let fieldsToFix =[];
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/;

  try {
    for (let i = 0; i < reqUniqueField.length; i++) {
      let value = reqUniqueField[i];
      let fieldName = reqUniqueName[i];
      let result = await pool.query(
        `SELECT * FROM accounts WHERE ${fieldName} = $1`,
        [value]
      );
      if (result.rows.length > 0) {
        fieldsToFix.push(fieldName);
      }
    }
    if (fieldsToFix.length > 0) {
      let fieldString = fieldsToFix.join(', ')
      return res.status(501).json({ error: "Username, email, or phone is already in use", details: 'Field(s): ' + fieldString + ' are already in use' });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format", details: "Please provide a valid email address" });
      }

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: "Invalid phone number format", details: "Phone number must be 10 digits long." });
      }

      if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: "Weak password", details: "Password must contain at least one capital letter, one lowercase letter, one number, and be at least 5 characters long." });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const couponCode = randomstring.generate({
          length: 10,
          capitalization: 'uppercase'
      });
      const result = await pool.query(
        'INSERT INTO accounts(username, email, password_hash, phone_number, is_seller) VALUES($1, $2, $3, $4, $5) RETURNING user_id',
        [username, email, hashedPassword, phone, isSeller]
      );
      const userId = result.rows[0].user_id;
      if (!isSeller) {
          await pool.query(
              "INSERT INTO coupons(code, userid) VALUES ($1, $2)", [couponCode, userId]
          );
      };
      return res.status(201).json({ userId: userId, message: "User successfully created." });

    }
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: "Signup failed", details: error.message });
  }
};


module.exports = async(req, res) => {
  res = signupFunc(req, res);
};