const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    spotifyId: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    tokenExpires: { type: Date, required: true },
});

module.exports = mongoose.model('User', UserSchema);