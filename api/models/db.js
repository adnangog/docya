const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const mongoDB = 'mongodb://localhost/docya';

mongoose.connect(mongoDB, (err) => {
    if (err) {
        console.log('mongoose hatasi : ' + err);
    } else {
        console.log('mongoose baglandi : ' + mongoDB);
    }
});