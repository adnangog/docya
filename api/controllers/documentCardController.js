const mongoose = require('mongoose');
const path = require('path');
const DocumentCard = require('../models/documentcards');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.documentcardAdd = [checkAuth, (req, res, next) => {
    const documentcard = new DocumentCard({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        authSet: req.body.authSet,
        user: req.body.user,
        status: 1,
        type: req.body.type,
        form: req.body.form,
        fields: req.body.fields,
        rDate: req.body.rDate
    });

    documentcard.save().then(result => {
        res.status(201).json({
            message: "Kart kaydedildi.",
            messageType: 1,
            documentcard: documentcard
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });

}];

module.exports.documentcardUpdate = [checkAuth, (req, res, next) => {
    const documentcardId = req.params.documentcardId;

    DocumentCard.update({ _id: documentcardId }, { $set: req.body })
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

module.exports.documentcardGet = [checkAuth, (req, res, next) => {
    const documentcardId = req.params.documentcardId;
    DocumentCard.findById(documentcardId)
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

module.exports.documentcardList = [checkAuth, (req, res, next) => {
    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }
    var data = 'ere';

    DocumentCard.aggregate([
        { $match: { "fields.musteriAdi": new RegExp(data, 'i') } },
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
                Object.keys(docs[0].data[0].fields[0]).map(x => data.header[0].push(x));

                data.data.map((d, i) => {
                    Object.keys(d[cIndex][0]).map(f => d.push(d[cIndex][0][f]));
                    d.splice(cIndex, 1)
                });
            }

            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}]

module.exports.documentcardDelete = [checkAuth, (req, res, next) => {
    const documentcardId = req.params.documentcardId;
    DocumentCard.remove({ _id: documentcardId })
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

function arrayToString(arr) {
    let str = '';
    arr.forEach(function (i, index) {
        str += i;
        if (index != (arr.length - 1)) {
            str += ',';
        };
    });
    return str;
}