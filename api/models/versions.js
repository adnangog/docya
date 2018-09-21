const mongoose = require('mongoose');

const schema = mongoose.Schema;

const versionSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document'},
        code: { type: String, required: true },
        date: { type: Date, required: true },
        uDate: Date,
        name: String,
        file: String,
        filename: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        uUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        fileType: String,
        size: Number,
        fields : [mongoose.Schema.Types.Mixed],
        status: { type: Number, required: true }
    }

);

const Version = mongoose.model('Version', versionSchema);

module.exports = Version;