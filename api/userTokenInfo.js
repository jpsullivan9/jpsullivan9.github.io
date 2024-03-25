const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    const { token } = req.body;
    jwt.verify(token, 'superSecret', (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Token has expired
                res.status(401).json({ error: "Token has Expired." });
            } else {
                // Other verification errors
                res.status(401).json({ error: "Token Verification has Failed." });
            }
        } else {
            // Token verification successful
            res.status(200).json({userID: decoded.userId, username: decoded.username, isSeller: decoded.isSeller});
        }
    });
}