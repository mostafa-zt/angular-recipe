const express = require('express');
const { validationResult } = require('express-validator');
const multer = require('multer')

// const { removeFile } = require('../util/fileUtility');
// const { storage } = require('../middleware/multerDiskStorage');
const Recipe = require('../model/recipe');
const checkAuthMiddleWare = require('../middleware/check-auth');
const { recipeValidator } = require('../validation/expressValidator');
const cloudinaryUtility = require('../util/cloudinaryUtility');

const router = express.Router();

const upload = multer();

router.post('/create-recipe', checkAuthMiddleWare, upload.single('image'), recipeValidator(), (req, res, next) => {
    const errors = validationResult(req).array().map(err => err.msg) || [];
    if (!req.file)
        errors.push("There is no any image to upload!");
    if (errors.length > 0) {
        // error status 422
        return res.json({ success: false, message: errors });
    }
    // const url = req.protocol + '://' + req.get('host'); // req.protocol ==> http or https
    cloudinaryUtility.streamUpload(req.file).then(result => {
        const recipe = new Recipe({
            name: req.body.name,
            // imagePath: url + '/images/' + req.file.filename,
            imagePath: result.url,
            description: req.body.description,
            ingredients: JSON.parse(req.body.ingredients),
            publicId: result.public_id,
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
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: false, message: err });
    })
});

router.put('/update-recipe', checkAuthMiddleWare, upload.single('image'), recipeValidator(), async (req, res, next) => {
    const errors = validationResult(req).array().map(err => err.msg) || [];
    if (errors.length > 0) {
        // error status 422
        return res.json({ success: false, message: errors });
    }
    let recipe;
    if (req.file) {
        // const url = req.protocol + '://' + req.get('host'); // req.protocol ==> http or https        
        // imagePath = url + '/images/' + req.file.filename;
        // serverRelativePath = 'backend/images/' + req.file.filename;
        const uploadResult = await cloudinaryUtility.streamUpload(req.file);
        recipe = new Recipe({
            _id: req.body._id,
            name: req.body.name,
            imagePath: uploadResult.url,
            description: req.body.description,
            ingredients: JSON.parse(req.body.ingredients),
            publicId: uploadResult.public_id,
            creator: req.userData.userId
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
                cloudinaryUtility.removeFile(oldRecipe.publicId);
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
        cloudinaryUtility.removeFile(doc.publicId);
        return res.status(200).json({
            success: true,
            message: 'This recipe has been successfully removed.',
            data: doc
        })
    })
})

router.get('/get-recipes', checkAuthMiddleWare, (req, res, next) => {
    const count = +req.query.count;
    const skip = req.query.skip | 0;

    Recipe.find({ creator: req.userData.userId })
        .skip(skip)
        .sort({ 'createdAt': -1 })
        .limit(count)
        .exec((err, docs) => {
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


router.get('/recipe', (req, res, next) => {
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

router.get('/new-recipes', (req, res, next) => {
    Recipe.find().sort({ 'createdAt': -1 }).limit(3).exec((err, doc) => {
        if (err) return res.status(400).send(err);
        res.send(doc);
    });
});

router.get('/all-recipes', (req, res, next) => {
    const count = +req.query.count;
    const skip = req.query.skip | 0;
    
    Recipe.find()
    .skip(skip)
    .sort({ 'createdAt': -1 })
    .limit(count)
    .exec((err, docs) => {
        res.send({
            recipes: docs
        });
    });
});

module.exports = router;