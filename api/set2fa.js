const { authenticator } = require('otplib');
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
});
module.exports = async(req, res) => {
    try{
    const { userID, key } = req.body;
    let result = await pool.query(
        `SELECT temp_secret FROM accounts WHERE user_id = $1`,
        [userID]
      );
    const tempSecretRow = result.rows[0]; // Assuming there's only one row returned
    const tempSecret = tempSecretRow.temp_secret;
      const verified = authenticator.check(key, tempSecret);
      if(!verified){
        return res.status(401).json({ error: "Invalid Code" });
      }
      else{
        const result = await pool.query(
            `UPDATE accounts SET secret = $1 WHERE user_id = $2`,
            [tempSecret, userID]
        );
        const result2 = await pool.query(
            `UPDATE accounts SET is_2fa = $1 WHERE user_id = $2`,
            [true, userID]
        );
        if (result.rowCount === 0 && result2.rowCount === 0) {
          return res.status(404).json({ error: "Invalid userID" })
        }
        return res.status(200).json({message: "Success"});
      }
    }
    catch(e){
        res.status(500).json({error:`Error with setting 2fa. Error is ${e}`})
    }

}