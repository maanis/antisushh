const jwt = require('jsonwebtoken');

const isAuthenticated = async function (req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ message: 'Unauthorized', success: false });
            return;
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            res.status(401).json({ message: 'Unauthorized', success: false });
            return;
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

module.exports = isAuthenticated;