const mongoose = require('mongoose');
const config = require('../config');
mongoose.Promise = global.Promise;  

mongoose.connect(config.db,function (err) {
    if(err){
        console.error(config,err.message);
    }
});

require('./choice');

exports.Choice = mongoose.model('Choice');