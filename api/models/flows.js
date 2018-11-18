const mongoose = require('mongoose');

const schema = mongoose.Schema;

const flowSchema = new schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flow' },
        flowTemplate: { type: mongoose.Schema.Types.ObjectId, ref: 'FlowTemplate' },
        name: { type: String, required: true },
        authSet: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthoritySet' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        formType:{ type: mongoose.Schema.Types.ObjectId, ref: 'FormType' },
        form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
        fields : [mongoose.Schema.Types.Mixed],
        formVer: { type: mongoose.Schema.Types.ObjectId, ref: 'FormVer' },
        organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
        calendar: { type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' },
        steps : [mongoose.Schema.Types.Mixed],
        status: Number,
        currentStep: Number,
        rDate: Date
    }

);

const Flow = mongoose.model('Flow', flowSchema);

module.exports = Flow;