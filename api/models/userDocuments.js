const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userDocumentSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: String,
        rDate: Date,
        status: { type: Number, required: true }
    }

);

const UserDocument = mongoose.model('UserDocument', userDocumentSchema);

module.exports = UserDocument;