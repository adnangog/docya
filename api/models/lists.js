const mongoose = require('mongoose');

const schema = mongoose.Schema;

const listSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        description: String,
        items : [mongoose.Schema.Types.Mixed],
        rDate: Date
    }

);

const List = mongoose.model('List', listSchema);

module.exports = List;