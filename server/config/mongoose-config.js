const { default: mongoose } = require("mongoose");

const connection = mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('connected to mongoDB') }).catch((err) => { console.log(err) });

module.exports = connection;