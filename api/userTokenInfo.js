const jwt = require('jsonwebtoken');

async function tokenInfo(req, res){
    const { token } = req.body;
    jwt.verify(token, 'superSecret', (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Token has expired
                return res.status(401).json({ error: "Token has Expired." });
            } else {
                // Other verification errors
                return res.status(401).json({ error: "Token Verification has Failed." });
            }
        } else {
            // Token verification successful
            return res.status(200).json({userID: decoded.userId, username: decoded.username, isSeller: decoded.isSeller});
        }
    });
}

module.exports = async (req, res) => {
    res = tokenInfo(req, res);
};