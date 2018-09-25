const mongoose = require('mongoose');

const schema = mongoose.Schema;

var searchSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    fields : [mongoose.Schema.Types.Mixed],
    rDate: Date,
}, {strict: false});

const Search = mongoose.model('Search', searchSchema);

module.exports = Search;