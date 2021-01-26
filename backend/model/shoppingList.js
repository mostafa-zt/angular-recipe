const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shoppingListSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

module.exports = mongoose.model("ShoppingList", shoppingListSchema);