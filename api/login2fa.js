const { authenticator } = require('otplib');
const { Pool } = require("pg");
const jwt = require('jsonwebtoken');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
});
const login2fa = async(req, res) => {
    try{
    let { twoFaProfile, code } = req.body;
    if (!twoFaProfile.hasOwnProperty('id') ||
        !twoFaProfile.hasOwnProperty('username') ||
        !twoFaProfile.hasOwnProperty('seller') ||
        !twoFaProfile.hasOwnProperty('coupon')) {
          return res.status(404).json({ error: "Invalid profile" });
    }
    let result = await pool.query(
        `SELECT secret FROM accounts WHERE user_id = $1`,
        [twoFaProfile.id]
      );
    const SecretRow = result.rows[0]; // Assuming there's only one row returned
    const secret = SecretRow.secret;
      const verified = authenticator.check(code, secret);
      if(!verified){
        return res.status(401).json({ error: "Invalid Code" });
      }
      else{
        const tokenAuth = jwt.sign({ userId: twoFaProfile.id, username: twoFaProfile.username, isSeller: twoFaProfile.seller }, 'superSecret', { expiresIn: '1h' });
        return res.status(200).json({ token: tokenAuth, profile: { id: twoFaProfile.id, username: twoFaProfile.username, seller: twoFaProfile.seller, coupon: twoFaProfile.code }, message: "Login successful." });
      }
    }
    catch(e){
        res.status(500).json({error:`Error with 2fa Login. Error is ${e}`})
    }

}

module.exports = login2fa;