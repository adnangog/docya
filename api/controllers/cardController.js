const mongoose = require('mongoose');
const path = require('path');
const Card = require('../models/cards');
const Folder = require('../models/folders');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");
const helper = require("../helpers/index");

module.exports.cardAdd = [checkAuth, (req, res, next) => {
    const card = new Card({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        authSet: req.body.authSet,
        user: req.body.user,
        status: 1,
        type: req.body.type,
        form: req.body.form,
        cardTemplate: req.body.cardTemplate,
        fields: req.body.fields,
        rDate: req.body.rDate
    });

    card.save().then(result => {
        const folder = new Folder({
            _id: new mongoose.Types.ObjectId(),
            name: "Dökümanlar",
            rDate: req.body.rDate,
            description: null,
            parent: null,
            user: req.body.user,
            card: card._id,
            childs: [],
            sortIndex: 0,
            status: 1
        });

        folder.save().then(result => {
            res.status(201).json({
                message: "Kart kaydedildi.",
                messageType: 1,
                card: card
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

module.exports.cardUpdate = [checkAuth, (req, res, next) => {
    const cardId = req.params.cardId;

    Card.update({ _id: cardId }, { $set: req.body })
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

module.exports.cardGet = [checkAuth, (req, res, next) => {
    const cardId = req.params.cardId;
    Card.findById(cardId)
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
}];

module.exports.cardList = [checkAuth, (req, res, next) => {
    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }
    var data = '';

    let query = {};

    if (req.body.cardTemplateId) {
        query = { "cardTemplate": mongoose.Types.ObjectId(req.body.cardTemplateId) }
    }

    Card.aggregate([
        //  { $match: { $or: [ { "fields.adiniz_soyadiniz": new RegExp(data, 'i') }, { "fields.egitim_durumu": new RegExp(data, 'i') } ] } },
        { $match: query },
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
                        "Kayıt Tarihi"
                    ]
                ],
                "data": docs[0].data.map((x, i) => [
                    x._id,
                    x.name,
                    x.type === 1 ? "Dosya Kartı" : "Kabinet",
                    x.status === 1 ? "Aktif" : "Pasif",
                    moment(x.rDate).format("YYYY-MM-DD HH:mm:ss"),
                    x.fields // cIndex degiskeni degerini bu itemin indexinden aliyor.
                ]),
                "count": docs[0].info.length > 0 ? docs[0].info[0].count : 0
            };

            let cIndex = 5;

            if (docs[0].data.length > 0) {
                !!docs[0].data[0].fields && Object.keys(docs[0].data[0].fields[0]).map(x => data.header[0].push(helper.cHeaderText(x)));

                data.data.map((d, i) => {
                    if (!!d[cIndex]) {
                        Object.keys(d[cIndex][0]).map(f => d.push(d[cIndex][0][f]));
                        d.splice(cIndex, 1)
                    }
                });
            }

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

module.exports.cardDelete = [checkAuth, (req, res, next) => {
    const cardId = req.params.cardId;
    Card.remove({ _id: cardId })
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