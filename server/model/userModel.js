const mongoose = require('mongoose');

const userScheme = mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    connections: {
        type: Array,
    },
})

const userModel = mongoose.model('user', userScheme);

module.exports = userModel;