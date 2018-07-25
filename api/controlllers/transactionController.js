const mongoose = require('mongoose');
const path = require('path');
const Transaction = require('../models/transactions');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.transactionAdd = [checkAuth,(req, res, next) => {
    const transaction = new Transaction({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.user,
        type: req.body.type,
        document: req.body.document,
        card: req.body.card,
        rDate: req.body.rDate,
    });

    transaction.save().then(result => {
        res.status(201).json({
            message: "Dokuman kaydedildi.",
            messageType: 1,
            transaction: transaction
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });

    
}];

module.exports.transactionUpdate = [checkAuth,(req, res, next) => {
    const transactionId = req.params.transactionId;
    Transaction.update({ _id: transactionId }, { $set: req.body })
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

module.exports.transactionGet = [checkAuth,(req, res, next) => {
    const transactionId = req.params.transactionId;
    Transaction.findById(transactionId)
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

module.exports.transactionList = [checkAuth,(req, res, next) => {

    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }
    Transaction.aggregate([
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
                        "Tip",
                        "Ekleyen",
                        "Kart",
                        "Döküman",
                        "Kayıt Tarihi",
                    ]
                ],
                "data": docs[0].data.map((x) => [
                    x._id,
                    x.type,
                    x.user,
                    x.card,
                    x.document,
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

module.exports.transactionDelete = [checkAuth,(req, res, next) => {
    const transactionId = req.params.transactionId;
    Transaction.remove({ _id: transactionId })
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