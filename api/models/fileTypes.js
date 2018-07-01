const mongoose = require('mongoose');

const schema = mongoose.Schema;

const fileTypeSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        rDate: Date
    }

);

const FileType = mongoose.model('FileType', fileTypeSchema);

module.exports = FileType;