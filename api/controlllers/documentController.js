const mongoose = require('mongoose');
const path = require('path');
const Document = require('../models/documents');
const DocumentType = require('../models/documentTypes');

module.exports.documentAdd = (req, res, next) => {
    const document = new Document({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        type: req.body.type,
        rDate: req.body.rDate,
        publishFirstDate: req.body.publishFirstDate,
        publishEndDate: req.body.publishEndDate,
        department: req.body.department,
        user: req.body.user,
        description: req.body.description,
        tags: req.body.tags,
        status: req.body.status,
        version: req.body.version
    });

    document.save().then(result => {
        res.status(201).json({
            message: "Dokuman kaydedildi.",
            messageType: 1,
            document: document
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });
};

module.exports.documentUpdate = (req, res, next) => {
    const documentId = req.params.documentId;
    Document.update({ _id: documentId }, { $set: req.body })
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

module.exports.documentGet = (req, res, next) => {
    const documentId = req.params.documentId;
    Document.findById(documentId)
        .populate('type', 'name')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "Bu id'ye ait bir kayit bulunamadi.", messageType: 0 });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

module.exports.documentList = (req, res, next) => {

    Document.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

module.exports.documentDelete = (req, res, next) => {
    const documentId = req.params.documentId;
    Document.remove({ _id: documentId })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}

module.exports.documentTypeAdd = (req, res, next) => {
    const documentType = new DocumentType({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        rDate: req.body.rDate
    });

    documentType.save().then(result => {
        res.status(201).json({
            message: "Dokuman Tipi kaydedildi.",
            messageType: 1,
            documentType: documentType
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });


};

module.exports.documentTypeUpdate = (req, res, next) => {
    const typeId = req.params.typeId;
    DocumentType.update({ _id: typeId }, { $set: req.body })
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

module.exports.documentTypeGet = (req, res, next) => {
    const typeId = req.params.typeId;
    DocumentType.findById(typeId)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "Bu id'ye ait bir kayit bulunamadi.", messageType: 0 });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

module.exports.documentTypeList = (req, res, next) => {

    DocumentType.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

module.exports.documentTypeDelete = (req, res, next) => {
    const typeId = req.params.typeId;
    DocumentType.remove({ _id: typeId })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

}