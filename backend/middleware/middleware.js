const { JWT_SECRET } = require("../config/jsontoken");
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];
    //console.log(token)

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token verification failed" });
    }
};

module.exports = {
    authMiddleware: authMiddleware
};
