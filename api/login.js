const database = require("./database");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const loginFunc = async (req, res) => {
    const { email, password } = req.body;

    try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format", details: "Please provide a valid email address" });
      }
        const { rows } = await database.query("SELECT a.user_id, a.username, a.is_seller, a.password_hash, a.is_2fa, c.code FROM accounts AS a LEFT JOIN coupons AS c ON a.user_id = c.userid WHERE (c.active = TRUE OR c.active IS NULL) AND a.email = $1", [email]);
        if (rows.length > 0) {
            const user = rows[0];
            const isValid = await bcrypt.compare(password, user.password_hash);
            const tokenAuth = jwt.sign({ userId: user.user_id, username: user.username, isSeller: user.is_seller }, 'superSecret', { expiresIn: '1h' });
            if (isValid) {
                if(!user.is_2fa){
                    return res.status(200).json({ token: tokenAuth, 
                        profile: { id: user.user_id, username: user.username, seller: user.is_seller, coupon: user.code }, 
                        message: "Login successful.", is_2fa: false });
                }
                else{
                    return res.status(200).json({profile: { id: user.user_id, username: user.username, seller: user.is_seller, coupon: user.code }, is_2fa: true})
                }
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

module.exports = loginFunc;
