const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Document = require('../models/documents');
const Version = require('../models/versions');
const DocumentType = require('../models/documentTypes');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports.documentAdd = [checkAuth, (req, res, next) => {

    const version = new Version({
        _id: new mongoose.Types.ObjectId(),
        code: "1.0.0",
        date: req.body.rDate,
        file: req.body.file,
        filename: req.body.filename,
        user: req.body.user,
        fileType: "jpg",
        status: 1
    });

    version.save().then(result => {
        const document = new Document({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            rDate: req.body.rDate,
            department: req.body.department,
            user: req.body.user,
            folder: req.body.folder,
            card: req.body.card,
            authSet: req.body.authSet,
            description: req.body.description,
            tags: [],
            status: req.body.status,
            version: version._id
        });

        document.save().then(result => {
            res.status(201).json({
                message: "Dokuman kaydedildi.",
                messageType: 1,
                document: document
            });
        }).catch(err => {
            res.status(500).json({
                messageType: -1,
                message: "Bir hata oluştu.",
                error: err
            });
        });

    }).catch(err => {
        res.status(500).json({
            messageType: -1,
            message: "Bir hata oluştu.",
            error: err
        });
    });

}];

module.exports.documentAdds = [checkAuth, (req, res, next) => {

    let totalItems = !!req.body.json && JSON.parse(req.body.json).length || 0;


    totalItems > 0 && JSON.parse(req.body.json).map((x, i) => {
        const version = new Version({
            _id: new mongoose.Types.ObjectId(),
            code: "1.0.0",
            date: req.body.rDate,
            name: x.name,
            file: x.filename,
            filename: x.originalname,
            user: req.body.user,
            fileType: x.mimetype,
            size: x.size,
            status: 1
        });

        version.save().then(result => {
            const document = new Document({
                _id: new mongoose.Types.ObjectId(),
                name: x.name,
                rDate: req.body.rDate,
                user: req.body.user,
                folder: req.body.folder,
                card: req.body.card,
                authSet: req.body.authSet,
                status: req.body.status,
                version: version._id
            });

            document.save().then(result => {
                Version.update({ _id: mongoose.Types.ObjectId(document.version) }, { $set: { document: mongoose.Types.ObjectId(document._id) } })
                    .exec()
                    .then(doc => {
                        if (totalItems - i === 1) {
                            res.status(201).json({
                                message: "Dokuman(lar) kaydedildi.",
                                messageType: 1
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            messageType: -1,
                            message: "Bir hata oluştu.",
                            error: err
                        });
                    });

            }).catch(err => {
                res.status(500).json({
                    messageType: -1,
                    message: "Bir hata oluştu.",
                    error: err
                });
            });

        }).catch(err => {
            res.status(500).json({
                messageType: -1,
                message: "Bir hata oluştu.",
                error: err
            });
        });
    });

}];

module.exports.documentUpdate = [checkAuth, (req, res, next) => {
    const documentId = req.params.documentId;
    Document.update({ _id: documentId }, { $set: req.body })
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({
                messageType: -1,
                message: "Bir hata oluştu.",
                error: err
            });
        });
}]

module.exports.documentGet = [checkAuth, (req, res, next) => {
    const documentId = req.params.documentId;
    Document.findById(documentId)
        .populate('version')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "Bu id'ye ait bir kayit bulunamadi.", messageType: 0 });
            }
        })
        .catch(err => {
            res.status(500).json({
                messageType: -1,
                message: "Bir hata oluştu.",
                error: err
            });
        });
}]

module.exports.documentList = [checkAuth, (req, res, next) => {

    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }
    Document.aggregate([
        { $match: {} },
        { $lookup: { from: 'cards', localField: 'card', foreignField: '_id', as: 'card' } },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
        { $lookup: { from: 'folders', localField: 'folder', foreignField: '_id', as: 'folder' } },
        { $lookup: { from: 'departments', localField: 'department', foreignField: '_id', as: 'department' } },
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
                    `${moment(x.publishFirstDate).format("YYYY-MM-DD")} - ${moment(x.publishFirstDate).format("YYYY-MM-DD")}`,
                    x.department.length > 0 ? x.department[0].name : [],
                    x.user.length > 0 ? `${x.user[0].fName} ${x.user[0].lName}` : [],
                    x.folder.length > 0 ? x.folder[0].name : [],
                    x.card.length > 0 ? x.card[0].name : [],
                    x.description,
                    x.version,
                    x.status === 1 ? "Aktif" : "Pasif",
                    moment(x.rDate).format("YYYY-MM-DD HH:mm:ss")
                ]),
                "count": docs[0].info[0].count
            };
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                messageType: -1,
                message: "Bir hata oluştu.",
                error: err
            });
        });
}]

module.exports.documentDelete = [checkAuth, (req, res, next) => {
    const documentId = req.params.documentId;
    Document.remove({ _id: documentId })
        .exec()
        .then(result => {
            Version.remove({ document: mongoose.Types.ObjectId(documentId) }).exec()
                .then(result => {
                    res.status(200).json({
                        messageType: 1,
                        message: "işlem başarılı."
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        messageType: -1,
                        message: "Bir hata oluştu.",
                        error: err
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                messageType: -1,
                message: "Bir hata oluştu.",
                error: err
            });
        });

}]

module.exports.documentTypeAdd = [checkAuth, (req, res, next) => {
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
            messageType: -1,
            message: "Bir hata oluştu.",
            error: err
        });
    });


}];

module.exports.documentTypeUpdate = [checkAuth, (req, res, next) => {
    const typeId = req.params.typeId;
    DocumentType.update({ _id: typeId }, { $set: req.body })
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({
                messageType: -1,
                message: "Bir hata oluştu.",
                error: err
            });
        });
}]

module.exports.documentTypeGet = [checkAuth, (req, res, next) => {
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
            res.status(500).json({
                messageType: -1,
                message: "Bir hata oluştu.",
                error: err
            });
        });
}]

module.exports.documentTypeList = [checkAuth, (req, res, next) => {

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
                "count": docs[0].info[0].count
            };
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                messageType: -1,
                message: "Bir hata oluştu.",
                error: err
            });
        });
}]

module.exports.documentTypeDelete = [checkAuth, (req, res, next) => {
    const typeId = req.params.typeId;
    DocumentType.remove({ _id: typeId })
        .exec()
        .then(result => {
            res.status(200).json({
                messageType: 1,
                message: "işlem başarılı."
            });
        })
        .catch(err => {
            res.status(500).json({
                messageType: -1,
                message: "Bir hata oluştu.",
                error: err
            });
        });

}]

module.exports.versionsByDocumentId = [checkAuth, (req, res, next) => {
    const documentId = req.params.documentId;
    Version.find({ "document": mongoose.Types.ObjectId(documentId) })
        .exec()
        .then(doc => {
            res.status(200).json({
                messageType: 1,
                message: "işlem başarılı",
                data: doc
            });
        })
        .catch(err => {
            res.status(500).json({
                messageType: -1,
                message: "Bir hata oluştu.",
                error: err
            });
        });
}]