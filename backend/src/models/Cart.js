const {schema} = require('./schema');

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: [true, 'Book is required']
        }
    ]
}, {timestamps: true});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;