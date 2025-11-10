const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
}, { 
    timestamps: true,
    versionKey: false // Remove __v field
});

// Ensure the collection name is explicitly set
const User = mongoose.model('User_Collection', userSchema, 'users_collection');

module.exports = User;
