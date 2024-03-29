const { Pool } = require("pg");
const bcrypt = require('bcrypt');
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  const { username, email, password, phone, isSeller } = req.body;
  const saltRounds = 10;
  const reqUniqueField = [username,email,phone];
  const reqUniqueName = ['username', 'email', 'phone_number']
  let fieldsToFix =[];
  try {
    for(let i =0; i<reqUniqueField.length; i++){
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
    if(fieldsToFix.length>0){
      let fieldString = fieldsToFix.join(', ')
      res.status(501).json({ error: "Username, email or phone is already in use", details: 'Field(s): '+fieldString+' are already in use'});
    }
    else{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({error: "Invalid email format", details: "Please provide a valid email address"});
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
          return res.status(400).json({error: "Invalid phone number format", details: "Phone number must be 10 digits long."});
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await pool.query(
          'INSERT INTO accounts(username, email, password_hash, phone_number, is_seller) VALUES($1, $2, $3, $4, $5) RETURNING user_id',
          [username, email, hashedPassword, phone, isSeller]
        );
        res.status(201).json({ userId: result.rows[0].user_id, message: "User successfully created." });
        
    }
  } catch (error) {
  console.error('Signup error:', error);
  res.status(500).json({ error: "Signup failed", details: error.message });
  }
};
