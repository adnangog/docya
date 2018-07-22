const mongoose = require('mongoose');
const Folder = require('../models/folders');
const checkAuth = require("../middleware/checkAuth");


module.exports.folderAdd = [checkAuth,(req, res, next) => {
    const folder = new Folder({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        rDate: req.body.rDate,
        description: req.body.description,
        parent: req.body.parent,
        card: req.body.card,
        childs: req.body.childs,
        sortIndex: req.body.sortIndex,
        status: req.body.status
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

    Folder.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
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