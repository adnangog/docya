const mongoose = require('mongoose');

const schema = mongoose.Schema;

var formLogSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document'},
    CardTemplate: { type: mongoose.Schema.Types.ObjectId, ref: 'CardTemplate'},
    fields : [mongoose.Schema.Types.Mixed],
    type : Number,

    rDate: Date,
}, {strict: false});

const FormLog = mongoose.model('FormLog', formLogSchema);

module.exports = FormLog;