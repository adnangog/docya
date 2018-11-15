const mongoose = require('mongoose');

const schema = mongoose.Schema;

var formSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    formType: { type: mongoose.Schema.Types.ObjectId, ref: 'FormType'},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fields : [mongoose.Schema.Types.Mixed],
    rDate: Date,
}, {strict: false});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;