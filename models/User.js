const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    orderedProducts: [
        {
            products: [
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Product'
                    },
                    productName: {
                        type: String,

                    },
                    quantity: {
                        type: Number,
                        min:1
                    },
                },
            ],
            totalAmount: {
                type: Number,
            },
            purchasedOn: {
                type: Date,
                default: new Date()
            }
        }
    ]
});

module.exports = mongoose.model('User', userSchema);
