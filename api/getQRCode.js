const qrcode = require ('qrcode');
const { authenticator } = require('otplib');
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
});


const qrCodeFunc = async(req, res) => {
    try {
    const { username, userId } = req.body;

    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(username, "Anzom", secret);
    const testing = await qrcode.toDataURL(uri);

    const result = await pool.query(
        `UPDATE accounts SET temp_secret = $1 WHERE username = $2`,
        [secret, username]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Invalid Username" });
    }

      res.status(200).json({image:testing});
    } catch (e) {
        res.status(500).json({error:`Error could not generate image. Error is ${e}`});
    }
}

module.exports = qrCodeFunc;
