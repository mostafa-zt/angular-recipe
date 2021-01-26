const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // ==> Bearer 123kj23lj4lkj2h
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "SUPER_SECRET_SHOULD_BE_LONGER");
        req.userData = { email: decodedToken.email, userId: decodedToken.userId }
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Authentication failed!" });
    }
};