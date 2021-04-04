const jwt = require('jsonwebtoken');
const config = require('../config/config').get(process.env.NODE_ENV);

module.exports = (req, res, next) => {
    try {
        // ==> Bearer 123kj23lj4lkj2h
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, config.SECRET);
        req.userData = { email: decodedToken.email, userId: decodedToken.userId }
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Authentication failed!" });
    }
};