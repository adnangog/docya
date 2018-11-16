const mongoose = require('mongoose');

const schema = mongoose.Schema;

var formVersionSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fields : [mongoose.Schema.Types.Mixed],
    rDate: Date,
}, {strict: false});

const FormVersion = mongoose.model('FormVersion', formVersionSchema);

module.exports = FormVersion;