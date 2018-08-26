const mongoose = require('mongoose');
const path = require('path');
const Note = require('../models/notes');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.noteAdd = [checkAuth, (req, res, next) => {
    const note = new Note({
        _id: new mongoose.Types.ObjectId(),
        note: req.body.note,
        user: req.body.user,
        document: req.body.document,
        folder: req.body.folder,
        version: req.body.version,
        status: 1,
        rDate: req.body.rDate
    });

    note.save().then(result => {
        res.status(201).json({
            message: "Not kaydedildi.",
            messageType: 1,
            note: note
        });
    }).catch(err => {
        res.status(500).json({
            messageType: -1,
            message: "Bir hata oluştu.",
            error: err
        });
    });

}];

module.exports.noteUpdate = [checkAuth, (req, res, next) => {
    const noteId = req.params.noteId;

    Note.update({ _id: noteId }, { $set: req.body })
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

module.exports.noteGet = [checkAuth, (req, res, next) => {
    const noteId = req.params.noteId;
    Note.findById(noteId)
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

module.exports.noteList = [checkAuth, (req, res, next) => {

    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }

    if (req.body.folder || req.body.document) {
        query = { $or: [{ "document": new RegExp(req.body.document, 'i') }, { "folder": new RegExp(req.body.folder, 'i') }] };
    }

    Note.aggregate([
        { $match: {} },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
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
                        "Not",
                        "Gonderen",
                        "Kayıt Tarihi",
                    ]
                ],
                "data": docs[0].data.map((x) => [
                    x._id,
                    x.note,
                    x.user.length > 0 ? `${x.user[0].fName} ${x.user[0].lName}` : [],
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

module.exports.noteDelete = [checkAuth, (req, res, next) => {
    const noteId = req.params.noteId;
    Note.remove({ _id: noteId })
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