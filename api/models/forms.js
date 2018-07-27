const mongoose = require('mongoose');

const schema = mongoose.Schema;

var formSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    rDate: Date,
    fields : [mongoose.Schema.Types.Mixed]
}, {strict: false});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;