const mongoose = require('mongoose');

const schema = mongoose.Schema;

const departmentSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        rDate: Date
    }

);

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;