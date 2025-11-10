const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        maxlength: 500
    },
    stock_quantity: {
        type: Number,
        required: true,
        min: 0
    }
}, { 
    timestamps: true,
    versionKey: false // Remove __v field
});

// Ensure the collection name is explicitly set
const Product = mongoose.model('Product_Collection', productSchema, 'products_collection');

module.exports = Product;