const mongoose = require('mongoose');

const schema = mongoose.Schema;

var formSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    formVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'FormVersion'},
    formType: { type: mongoose.Schema.Types.ObjectId, ref: 'FormType', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rDate: Date,
}, {strict: false});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;