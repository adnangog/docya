const mongoose = require('mongoose');

const schema = mongoose.Schema;

const noteSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        note: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
        document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
        version: { type: mongoose.Schema.Types.ObjectId, ref: 'Version' },
        status: Number,
        rDate: Date
    }

);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;