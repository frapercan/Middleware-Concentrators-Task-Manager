const mongoose = require('mongoose');
require('dotenv-safe').config();


mongoose.connect(process.env.MONGODB_URL, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model')
};


