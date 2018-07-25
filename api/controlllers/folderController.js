const mongoose = require('mongoose');
const Folder = require('../models/folders');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");


module.exports.folderAdd = [checkAuth,(req, res, next) => {
    const folder = new Folder({
        _id: new mongoose.Types.ObjectId(),
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

    folder.save().then(result => {
        res.status(201).json({
            message: "Klasör kaydedildi.",
            messageType: 1,
            folder: folder
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });
}];

module.exports.folderUpdate = [checkAuth,(req, res, next) => {
    const folderId = req.params.folderId;
    Folder.update({ _id: folderId }, { $set: req.body })
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

module.exports.folderGet = [checkAuth,(req, res, next) => {
    const folderId = req.params.folderId;
    Folder.findById(folderId)
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

module.exports.folderList = [checkAuth,(req, res, next) => {

    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }
    Folder.aggregate([
        { $match: {} },
         { $lookup: { from: 'cards', localField: 'card', foreignField: '_id', as: 'card' } },
         { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
         { $lookup: { from: 'folders', localField: 'parent', foreignField: '_id', as: 'parent' } },
        {
            $facet: {
                data: [
                    //   { $sort: sort },
                    { $skip: pageOptions.page },
                    { $limit: pageOptions.limit }
                ],
                info: [{ $group: { _id: null, count: { $sum: 1 } } }]
            }
        },
    ]).exec()
        .then(docs => {
            console.log(docs[0]);
            let data = {
                "header": [
                    [
                        "Id",
                        "Adı",
                        "Üst Klasör",
                        "Ekleyen",
                        "Kart",
                        "Açıklama",
                        "Durum",
                        "Kayıt Tarihi",
                    ]
                ],
                "data": docs[0].data.map((x) => [
                    x._id,
                    x.name,
                    x.parent.length > 0 ? x.parent[0].name : [],
                    x.user.length > 0 ? x.user[0].fName : [],
                    x.card.length > 0 ? x.card[0].name : [],
                    x.description,
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

module.exports.folderDelete = [checkAuth,(req, res, next) => {
    const folderId = req.params.folderId;
    Folder.remove({ _id: folderId })
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