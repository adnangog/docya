const mongoose = require('mongoose');

const schema = mongoose.Schema;

const tagSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        rDate: Date
    }

);

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;