const mongoose = require('mongoose');
const path = require('path');
const Document = require('../models/documents');
const DocumentType = require('../models/documentTypes');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.documentAdd = [checkAuth,(req, res, next) => {
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
}];

module.exports.documentUpdate = [checkAuth,(req, res, next) => {
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
}]

module.exports.documentGet = [checkAuth,(req, res, next) => {
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
}]

module.exports.documentList = [checkAuth,(req, res, next) => {

    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }
    Document.aggregate([
        { $match: {} },
        {
            $facet: {
                data: [
                    //   { $sort: sort },
                    { $skip: pageOptions.page },
                    { $limit: pageOptions.limit }
                ],
                info: [{ $group: { _id: null, count: { $sum: 1 } } }]
            }
        }
    ]).exec()
        .then(docs => {
            let data = {
                "header": [
                    [
                        "Id",
                        "Adı",
                        "Tipi",
                        "Yayın Tarihi",
                        "Departman",
                        "Ekleyen",
                        "Klasör",
                        "Kart",
                        "Açıklama",
                        "Versiyon",
                        "Durum",
                        "Kayıt Tarihi",
                    ]
                ],
                "data": docs[0].data.map((x) => [
                    x._id,
                    x.name,
                    x.type,
                    `${moment(x.publishFirstDate).format("YYYY-MM-DD")} - ${moment(x.publishFirstDate).format("YYYY-MM-DD")}`,
                    x.department,
                    x.user,
                    x.folder,
                    x.card,
                    x.description,
                    x.version,
                    x.status === 1 ? "Aktif" : "Pasif",
                    moment(x.rDate).format("YYYY-MM-DD HH:mm:ss")
                ]),
                "count":docs[0].info[0].count
            };
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}]

module.exports.documentDelete = [checkAuth,(req, res, next) => {
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

}]

module.exports.documentTypeAdd = [checkAuth,(req, res, next) => {
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


}];

module.exports.documentTypeUpdate = [checkAuth,(req, res, next) => {
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
}]

module.exports.documentTypeGet = [checkAuth,(req, res, next) => {
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
}]

module.exports.documentTypeList = [checkAuth,(req, res, next) => {

    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }
    DocumentType.aggregate([
        { $match: {} },
        {
            $facet: {
                data: [
                    //   { $sort: sort },
                    { $skip: pageOptions.page },
                    { $limit: pageOptions.limit }
                ],
                info: [{ $group: { _id: null, count: { $sum: 1 } } }]
            }
        }
    ]).exec()
        .then(docs => {
            let data = {
                "header": [
                    [
                        "Id",
                        "Adı",
                        "Kayıt Tarihi",
                    ]
                ],
                "data": docs[0].data.map((x) => [
                    x._id,
                    x.name,
                    moment(x.rDate).format("YYYY-MM-DD HH:mm:ss")
                ]),
                "count":docs[0].info[0].count
            };
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}]

module.exports.documentTypeDelete = [checkAuth,(req, res, next) => {
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

}]