const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config/config').get(process.env.NODE_ENV);
const { signupValidator, loginValidator } = require('../validation/expressValidator');
const User = require('../model/user');

const router = express.Router();

router.post("/signup", signupValidator(), (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        // error status 422
        return res.json({ success: false, message: errors.map(err => err.msg) });
    }
    // const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email }, (err, doc) => {
        if (err) return res.status(500).json({ success: false, message: "An error occurred while registering the user " });
        if (doc) return res.json({ success: false, message: "This email has been already saved!" });
        bcrypt.hash(password, 10, (err, encryptedPassword) => {
            if (err) return res.status(500).json({ success: false, message: "An error occurred while registering the user " });
            const user = new User({ email: email, password: encryptedPassword });
            user.save((err, user) => {
                if (err) return res.status(500).json({ success: false, message: "An error occurred while registering the user " });
                if (user)
                    return res.status(201).json({
                        success: true, message: "Your account has been successfuly registered.", data: user
                    });
            });
        });
    });
});

router.post('/login', loginValidator(), (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req).array().map(err => { return { msg: err.msg, param: err.param } }) || [];
    if (errors.length > 0) {
        // error status 422
        return res.json({ success: false, messages: errors });
    }
    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).json({ success: false, message: "An error occurred!" });
        if (!user) {
            errors.push({ msg: "Username or password is wrong!", param: '' })
            return res.json({ success: false, messages: errors });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) res.status(500).json({ success: false, message: "An error occurred while comparing the passowrd" });
            if (isMatch) {
                const token = jwt.sign({ email: user.email, userId: user._id }, config.SECRET, { expiresIn: "1h" });
                return res.status(200).json({ token: token, success: true, expiresIn: 3600 }); // ==> 3600 seconds = 1 hour
            }
            errors.push({ msg: "Username or password is wrong!", param: '' });
            return res.json({ success: false, messages: errors });
        })
    })
})

module.exports = router;