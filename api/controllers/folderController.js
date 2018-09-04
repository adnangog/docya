const mongoose = require("mongoose");
const Folder = require("../models/folders");
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.folderAdd = [
    checkAuth,
    (req, res, next) => {
        const folder = new Folder({
            _id: new mongoose.Types.ObjectId(),
            authSet: req.body.authSet,
            name: req.body.name,
            rDate: req.body.rDate,
            description: req.body.description,
            parent: req.body.parent,
            user: req.body.user,
            card: req.body.card,
            childs: [],
            sortIndex: 0,
            status: 1
        });

        folder.save()
            .then(result => {

                Folder.update({ _id: req.body.parent }, { $push: { childs: folder._id } }).exec()
                    .then(ups => {
                        res.status(201).json({
                            message: "Klasör kaydedildi.",
                            messageType: 1,
                            folder: folder
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            messageType: -1,
                            message: "Bir hata oluştu.",
                            error: err
                        });
                    });

                // Folder.aggregate([
                //     { $match: { _id: folder._id } },
                //     {
                //         $graphLookup: {
                //             from: "folders",
                //             startWith: "$parent",
                //             connectFromField: "parent",
                //             connectToField: "_id",
                //             maxDepth: 1,
                //             as: "parents"
                //         }
                //     }
                // ])
                //     .exec()
                //     .then(doc => {

                //         let ids = doc[0].parents.map(x => new mongoose.Types.ObjectId(x._id));

                //         Folder.update({ _id: { "$in": ids } }, { $push: { childs: folder._id } }, { multi: true }).exec()
                //             .then(ups => {
                //                 res.status(201).json({
                //                     message: "Klasör kaydedildi.",
                //                     messageType: 1,
                //                     folder: folder
                //                 });
                //             })
                //             .catch(err => {
                //                 console.log(err);
                //                 res.status(500).json({
                //                     error: err
                //                 });
                //             });
                //     })
                //     .catch(err => {
                //         res.status(500).json({
                //             error: err
                //         });
                //     });

            })
            .catch(err => {
                res.status(500).json({
                    messageType: -1,
                    message: "Bir hata oluştu.",
                    error: err
                });
            });
    }
];

module.exports.folderUpdate = [
    checkAuth,
    (req, res, next) => {
        const folderId = req.params.folderId;
        Folder.update({ _id: folderId }, { $set: req.body })
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
    }
];

module.exports.foldersByCardId = [
    checkAuth,
    (req, res, next) => {
        const cardId = req.params.cardId;

        let query = {};

        if (req.params.cardId) {
            query = { "card": mongoose.Types.ObjectId(cardId) }
        }

        Folder.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "documents",
                    localField: "_id",
                    foreignField: "folder",
                    as: "documents"
                }
            }, {
                $unwind: {
                    path: "$documents",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from: "versions",
                    localField: "documents.version",
                    foreignField: "_id",
                    as: "documents.versions"
                }
            }, {
                $group: {
                    _id: "$_id",
                    name: {
                        $first: "$name"
                    },
                    childs: {
                        $first: "$childs"
                    },
                    rDate: {
                        $first: "$rDate"
                    },
                    documents: {
                        $push: "$documents"
                    }
                }
            }, {
                $project: {
                    _id: 1,
                    name: 1,
                    childs: 1,
                    rDate: 1,
                    documents: {
                        $filter: {
                            input: "$documents",
                            as: "a",
                            cond: {
                                $ifNull: ["$$a._id", false]
                            }
                        }
                    }
                }
            },
            { $sort: { "rDate": 1 } }
        ])
            .exec()
            .then(doc => {
                let getir = (id) => {
                    let x = doc.filter((item) => { return item._id.toString() == id.toString() })[0];
                    if (x.childs.length > 0) {
                        if (x.documents.length > 0) {
                            return { id: x._id, name: x.name, type: "folder", childs: x.childs.map(y => getir(y)), documents: x.documents.map(y => { return { id: y._id, name: y.name, type: "document", file: y.versions.length > 0 ? y.versions[0].file : null, fileType: y.versions.length > 0 ? y.versions[0].fileType : null } }) }
                        } else {
                            return { id: x._id, name: x.name, type: "folder", childs: x.childs.map(y => getir(y)) }
                        }
                    }
                    else {
                        if (x.documents.length > 0) {
                            return { id: x._id, name: x.name, type: "folder", documents: x.documents.map(y => { return { id: y._id, name: y.name, type: "document", file: y.versions.length > 0 ? y.versions[0].file : null, fileType: y.versions.length > 0 ? y.versions[0].fileType : null } }) }
                        } else {
                            return { id: x._id, name: x.name, type: "folder" }
                        }
                    }
                };
                let folders = getir(doc[0]._id);
                if (doc) {
                    res.status(200).json({
                        folders: [folders]
                    });
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
    }
];
module.exports.folderGet = [
    checkAuth,
    (req, res, next) => {
        const folderId = req.params.folderId;
        Folder.findById(folderId)
            .exec()
            .then(doc => {
                if (doc) {
                    res.status(200).json(doc);
                } else {
                    res
                        .status(404)
                        .json({
                            message: "Bu id'ye ait bir kayit bulunamadi.",
                            messageType: 0
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
    }
];

module.exports.folderList = [
    checkAuth,
    (req, res, next) => {
        let pageOptions = {
            page: req.body.page || 0,
            limit: req.body.limit || 2
        };
        Folder.aggregate([
            { $match: {} },
            {
                $lookup: {
                    from: "cards",
                    localField: "card",
                    foreignField: "_id",
                    as: "card"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "folders",
                    localField: "parent",
                    foreignField: "_id",
                    as: "parent"
                }
            },
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
        ])
            .exec()
            .then(docs => {
                let data = {
                    header: [
                        [
                            "Id",
                            "Adı",
                            "Üst Klasör",
                            "Ekleyen",
                            "Kart",
                            "Açıklama",
                            "Durum",
                            "Kayıt Tarihi"
                        ]
                    ],
                    data: docs[0].data.map(x => [
                        x._id,
                        x.name,
                        x.parent.length > 0 ? x.parent[0].name : [],
                        x.user.length > 0 ? `${x.user[0].fName} ${x.user[0].lName}` : [],
                        x.card.length > 0 ? x.card[0].name : [],
                        x.description,
                        x.status === 1 ? "Aktif" : "Pasif",
                        moment(x.rDate).format("YYYY-MM-DD HH:mm:ss")
                    ]),
                    count: docs[0].info[0].count
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
    }
];

module.exports.folderDelete = [
    checkAuth,
    (req, res, next) => {
        const folderId = req.params.folderId;
        Folder.remove({ _id: folderId })
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
    }
];
