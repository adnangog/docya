const mongoose = require('mongoose');

const schema = mongoose.Schema;

var classSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    type: { type: Number, required: true },
    props : [mongoose.Schema.Types.Mixed],
    rDate: Date,
}, {strict: false});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;