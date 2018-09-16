const mongoose = require('mongoose');

const schema = mongoose.Schema;

const groupSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        rDate: Date
    }

);

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;