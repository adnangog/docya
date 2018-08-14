const mongoose = require('mongoose');
const path = require('path');
const CardTemplate = require('../models/cardtemplates');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.cardtemplateAdd = [checkAuth,(req, res, next) => {
    const cardtemplate = new CardTemplate({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        authSet: req.body.authSet,
        user: req.body.user,
        status: 1,
        type: req.body.type,
        form:req.body.form,
        rDate: req.body.rDate
    });

    cardtemplate.save().then(result => {
        res.status(201).json({
            message: "Taslak kaydedildi.",
            messageType: 1,
            cardtemplate: cardtemplate
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });

}];

module.exports.cardtemplateUpdate = [checkAuth,(req, res, next) => {
    const cardtemplateId = req.params.cardtemplateId;

    CardTemplate.update({ _id: cardtemplateId }, { $set: req.body })
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

module.exports.cardtemplateGet = [checkAuth,(req, res, next) => {
    const cardtemplateId = req.params.cardtemplateId;
    CardTemplate.findById(cardtemplateId)
        .populate('form', 'fields')
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

module.exports.cardtemplateList = [checkAuth,(req, res, next) => {
    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }
    CardTemplate.aggregate([
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
                        "Durum",
                        "Kayıt Tarihi",
                    ]
                ],
                "data": docs[0].data.map((x) => [
                    x._id,
                    x.name,
                    x.type === 1 ? "Dosya Kartı" : "Kabinet",
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

module.exports.cardtemplateDelete = [checkAuth,(req, res, next) => {
    const cardtemplateId = req.params.cardtemplateId;
    CardTemplate.remove({ _id: cardtemplateId })
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