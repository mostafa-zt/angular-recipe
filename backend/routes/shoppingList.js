const express = require('express');
const mongoose = require('mongoose');

const ShoppingList = require('../model/shoppingList');
const checkAuthMiddleWare = require('../middleware/check-auth');

const router = express.Router();

router.post('/create-shopping-list', checkAuthMiddleWare, (req, res, next) => {
    const shoppingList = req.body.map(shoppingList => {
        return {
            ...shoppingList,
            creator: mongoose.Types.ObjectId(req.userData.userId)
        };
    })
    ShoppingList.collection.insertMany(shoppingList, (err, docs) => {
        if (err) return res.status(500).json({ success: false, message: 'Error!' });
        return res.status(201).json({
            success: true,
            message: "Your shopping list has been successfully saved.",
            data: docs
        });
    });
});

router.post('/update-shopping-list', checkAuthMiddleWare, async (req, res, next) => {
    let updatedItems = [];
    const ids = req.body.map(item => item._id);
    const shoppingLists = await ShoppingList.find({ '_id': { $in: ids } });
    shoppingLists.forEach(model => {
        const data = req.body.find(f => f._id === model._id.toString());
        model.name = data.name;
        model.amount = data.amount;
        model.save();
        updatedItems.push(model);
    });
    res.status(200).json({
        success: true,
        message: "Your shopping list has been successfully updated.",
        data: updatedItems
    });
});

router.post('/delete-shopping-list', checkAuthMiddleWare, (req, res) => {
    const ids = req.body.map(i => i._id);
    ShoppingList.deleteMany({ '_id': { $in: ids } }, (err, doc) => {
        return res.status(200).json({
            success: true,
            message: 'This shopping list has been successfully removed.',
            data: req.body
        })
    });
});

router.get('/get-shopping-list', checkAuthMiddleWare, (req, res, next) => {
    ShoppingList.find({ creator: req.userData.userId }, (err, docs) => {
        if (err) res.status(500).json({ success: false, message: 'Error!' })
        res.status(200).json({ ingredients: docs });
    });
})

module.exports = router;