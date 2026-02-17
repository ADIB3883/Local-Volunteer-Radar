const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    googleAccessToken: { type: String , default: null },
    googleRefreshToken: { type: String, default: null },

});

module.exports = mongoose.model('User', UserSchema, 'Users');