const express = require('express');
const multer = require('multer');
const { validationResult } = require('express-validator');

const { removeFile } = require('../util/fileUtility');
const { storage } = require('../middleware/multerDiskStorage');
const Recipe = require('../model/recipe');
const checkAuthMiddleWare = require('../middleware/check-auth');
const { recipeValidator } = require('../validation/expressValidator');

const router = express.Router();

router.post('/create-recipe', checkAuthMiddleWare, multer({ storage: storage }).single('image'), recipeValidator(), (req, res, next) => {
    const errors = validationResult(req).array().map(err => err.msg) || [];
    if (!req.file)
        errors.push("There is no any image to upload!");
    if (errors.length > 0) {
        // error status 422
        return res.json({ success: false, message: errors });
    }
    const url = req.protocol + '://' + req.get('host'); // req.protocol ==> http or https
    const recipe = new Recipe({
        name: req.body.name,
        imagePath: url + '/images/' + req.file.filename,
        description: req.body.description,
        ingredients: JSON.parse(req.body.ingredients),
        serverRelativePath: 'backend/images/' + req.file.filename,
        creator: req.userData.userId
    });
    recipe.save((err, doc) => {
        if (err) res.status(500).json({ success: false, message: 'Error!' });
        res.status(201).json({
            success: true,
            message: "Recipe has been successfully saved.",
            data: doc
        });
    });
});

router.put('/update-recipe', checkAuthMiddleWare, multer({ storage: storage }).single('image'), recipeValidator(), async (req, res, next) => {
    const errors = validationResult(req).array().map(err => err.msg) || [];
    if (errors.length > 0) {
        // error status 422
        return res.json({ success: false, message: errors });
    }
    let imagePath = req.body.imagePath;
    let serverRelativePath = null;
    let recipe;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host'); // req.protocol ==> http or https
        imagePath = url + '/images/' + req.file.filename;
        serverRelativePath = 'backend/images/' + req.file.filename;
        recipe = new Recipe({
            _id: req.body._id,
            name: req.body.name,
            imagePath: imagePath,
            serverRelativePath: serverRelativePath,
            description: req.body.description,
            ingredients: JSON.parse(req.body.ingredients)
        });
    }
    else {
        recipe = new Recipe({
            _id: req.body._id,
            name: req.body.name,
            description: req.body.description,
            ingredients: JSON.parse(req.body.ingredients)
        });
    }
    Recipe.findOne({ _id: req.body._id, creator: req.userData.userId }).then(doc => {
        // 400 ==> Bad Request
        if (!doc) return res.status(400).json({ success: false, message: 'This recipe is not available!' })
        const oldRecipe = doc;
        Recipe.findByIdAndUpdate(req.body._id, recipe, { new: true }, (err, doc) => {
            if (err) res.status(500).json({ success: false, message: 'Error!' });
            if (req.file)
                removeFile(oldRecipe.serverRelativePath);
            return res.status(200).json({
                success: true,
                message: "Recipe has been successfully updated.",
                data: doc
            });
        })
    })
});

router.delete('/delete-recipe', checkAuthMiddleWare, (req, res, next) => {
    const id = req.query.id;
    Recipe.findByIdAndRemove(id, (err, doc) => {
        if (err) return res.json({ success: false, message: 'Error!' });
        removeFile(doc.serverRelativePath);
        return res.status(200).json({
            success: true,
            message: 'This recipe has been successfully removed.',
            data: doc
        })
    })
})

router.get('/get-recipes', checkAuthMiddleWare, (req, res, next) => {
    Recipe.find({ creator: req.userData.userId }, (err, docs) => {
        res.json({
            recipes: docs
        });
    });
});

router.get('/get-recipe', checkAuthMiddleWare, (req, res, next) => {
    const id = req.query['id'];
    Recipe.findById(id, (err, doc) => {
        if (err) res.json({ success: false, message: 'Error!' });
        if (!doc) res.status(400).json({ success: false, message: 'This recipe is not available!' })
        res.status(200).json({
            success: true,
            message: 'This recipe has been successfully fetched.',
            data: doc
        })
    })
});

module.exports = router;