const mongoose = require('mongoose');

const schema = mongoose.Schema;

const categorySchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        rDate: Date,
        description: String,
        parent: { type: String, required: true },
        sortIndex: Number,
        childs: []
    }

);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;