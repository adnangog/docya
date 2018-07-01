const mongoose = require('mongoose');

const schema = mongoose.Schema;

const documentTypeSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        rDate: Date
    }

);

const DocumentType = mongoose.model('DocumentType', documentTypeSchema);

module.exports = DocumentType;