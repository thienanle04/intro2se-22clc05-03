const { Schema } = require('mongoose');

const mongoose = require('mongoose');

const cartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CartItem',
            required: [true, 'CartItem is required']
        }
    ]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;