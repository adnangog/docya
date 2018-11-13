const mongoose = require('mongoose');

const schema = mongoose.Schema;

var formTypeSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items : [mongoose.Schema.Types.Mixed],
    rDate: Date,
}, {strict: false});

const FormType = mongoose.model('FormType', formTypeSchema);

module.exports = FormType;