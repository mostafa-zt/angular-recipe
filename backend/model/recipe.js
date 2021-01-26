const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 300,
        minlength:3
    },
    imagePath: {
        required: true,
        type: String
    },
    serverRelativePath: {
        type: String
    },
    description: {
        required: true,
        type: String
    },
    ingredients: [
        {
            name: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }
    ],
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

module.exports = mongoose.model('Recipe', recipeSchema);