const mongoose = require('mongoose');

const schema = mongoose.Schema;

const versionSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        code: { type: String, required: true },
        date: { type: Date, required: true },
        file: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        fileType: String,
        status: { type: Number, required: true }
    }

);

const Version = mongoose.model('Version', versionSchema);

module.exports = Version;