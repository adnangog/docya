const mongoose = require('mongoose');

const schema = mongoose.Schema;

const folderSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        rDate: Date,
        description: String,
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
        card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
        authSet: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthoritySet' },
        sortIndex: Number,
        childs: [],
        status: Number
    }

);

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;