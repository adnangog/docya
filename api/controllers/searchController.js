const mongoose = require('mongoose');
const path = require('path');
const Search = require('../models/searches');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.searchAdd = [checkAuth, (req, res, next) => {
    const search = new Search({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        fields: req.body.fields,
        user: req.body.user,
        form: req.body.form,
        status: 1,
        rDate: req.body.rDate
    });

    search.save().then(result => {
        res.status(201).json({
            message: "Arama kaydedildi.",
            messageType: 1,
            search: search
        });
    }).catch(err => {
        res.status(500).json({
            messageType: -1,
            message: "Bir hata oluştu.",
            error: err
        });
    });


}];

module.exports.searchUpdate = [checkAuth, (req, res, next) => {
    const searchId = req.params.searchId;
    console.log(searchId);
    Search.update({ _id: searchId }, { $set: req.body })
        .exec()
        .then(doc => {
            res.status(200).json({
                messageType: 1,
                message: "Arama Güncellendi",
                doc: doc
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

module.exports.searchGet = [checkAuth, (req, res, next) => {
    const searchId = req.params.searchId;
    Search.findById(searchId)
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

module.exports.searchList = [checkAuth, (req, res, next) => {
    Search.find({$and: [{ "form": mongoose.Types.ObjectId(req.body.form) }, { "user": mongoose.Types.ObjectId(req.body.user) }]}).exec()
            .then(docs => {
                res.status(201).json(docs);
            })
            .catch(err => {
                res.status(500).json({
                    messageType: -1,
                    message: "Bir hata oluştu.",
                    error: err
                });
            });
}]

module.exports.searchDelete = [checkAuth, (req, res, next) => {
    const searchId = req.params.searchId;
    Search.remove({ _id: searchId })
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