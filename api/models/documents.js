const mongoose = require('mongoose');

const schema = mongoose.Schema;

const documentSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        rDate: Date,
        uDate: Date,
        publishFirstDate: Date,
        publishEndDate: Date,
        checkOut: Boolean,
        department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        uUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
        card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
        authSet: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthoritySet' },
        description: String,
        tags: [],
        version: { type: mongoose.Schema.Types.ObjectId, ref: 'Version' },
        status: { type: Number, required: true }
    }

);

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;