const mongoose = require('mongoose');

const schema = mongoose.Schema;

const tagSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        from: String,
        to: String,
        cc: String,
        subject: String,
        message: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document'},
        rDate: Date
    }

);

const Mail = mongoose.model('Mail', tagSchema);

module.exports = Mail;