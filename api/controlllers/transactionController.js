const mongoose = require('mongoose');
const path = require('path');
const Transaction = require('../models/transactions');

module.exports.transactionAdd = (req, res, next) => {
    const transaction = new Transaction({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId,
        rDate: req.body.rDate,
        tpId: req.body.tpId,
        tpName: req.body.tpName,
        dcmId: req.body.dcmId,
        dcmName: req.body.dcmName,
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

    
};

module.exports.transactionUpdate = (req, res, next) => {
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
}

module.exports.transactionGet = (req, res, next) => {
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
}

module.exports.transactionList = (req, res, next) => {

    Transaction.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

module.exports.transactionDelete = (req, res, next) => {
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

}