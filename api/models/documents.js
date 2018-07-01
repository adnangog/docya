const mongoose = require('mongoose');

const schema = mongoose.Schema;

const documentSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        typeId: { type: Number, required: true },
        rDate: Date,
        publishFirstDate: Date,
        publishEndDate: Date,
        checkOut: Boolean,
        departmentId: Number,
        sDescription: String,
        lDescription: String,
        tags: [],
        version: {},
        versions: []
    }

);

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;