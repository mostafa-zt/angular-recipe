const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRouter = require('./routes/user');
const shoppingListRouter = require('./routes/shoppingList');
const recipeRouter = require('./routes/recipe');

const app = express();

mongoose.connect('mongodb+srv://mostafa:LUjiZggnXA6agN2f@cluster0.wvo17.mongodb.net/recipe?retryWrites=true&w=majority')
    .then(result => {
        console.log('Database Connected...');
    })
    .catch(err => {
        console.log('Connecting Faild...')
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));
app.use("/images", express.static(path.join(__dirname, "images")));
//Put your angular frontend folder here
app.use(express.static(path.join(__dirname, 'angular')));
// app.use('/', express.static(path.join(__dirname, '../frontend', 'angular-recipe')));

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     next();
// });

app.use('/api', shoppingListRouter)
app.use('/api', userRouter);
app.use('/api', recipeRouter);
app.use('/*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'angular', 'index.html'));
})

module.exports = app;