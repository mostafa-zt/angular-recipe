const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config/config').get(process.env.NODE_ENV);
const userRouter = require('./routes/user');
const shoppingListRouter = require('./routes/shoppingList');
const recipeRouter = require('./routes/recipe');

const app = express();

mongoose.connect(config.DATABASE)
    .then(result => {
        console.log('Database Connected...');
    })
    .catch(err => {
        console.log('Connecting Faild...')
    })

// for parsing application/json
app.use(express.json()); 
// for parsing application/xwww-
app.use(express.urlencoded({ extended: true })); 
//form-urlencoded

app.use("/images", express.static(path.join(__dirname, "images")));
//Put your angular frontend folder here
app.use(express.static(path.join(__dirname, 'angular')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Content-Length , Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

app.use('/api', shoppingListRouter)
app.use('/api', userRouter);
app.use('/api', recipeRouter);
if (process.env.NODE_ENV === 'production') {
    app.use('/*', (req, res, next) => {
        res.sendFile(path.join(__dirname, 'angular', 'index.html'));
    })
}

module.exports = app;