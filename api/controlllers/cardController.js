const mongoose = require('mongoose');
const path = require('path');
const Card = require('../models/cards');
const checkAuth = require("../middleware/checkAuth");

module.exports.cardAdd = [checkAuth,(req, res, next) => {
    const card = new Card({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        authSet: req.body.authSet,
        rDate: req.body.rDate
    });

    card.save().then(result => {
        res.status(201).json({
            message: "Kart kaydedildi.",
            messageType: 1,
            card: card
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });

}];

module.exports.cardUpdate = [checkAuth,(req, res, next) => {
    const cardId = req.params.cardId;

    Card.update({ _id: cardId }, { $set: req.body })
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

module.exports.cardGet = [checkAuth,(req, res, next) => {
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
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}]

module.exports.cardList = [checkAuth,(req, res, next) => {

    Card.find()
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

module.exports.cardDelete = [checkAuth,(req, res, next) => {
    const cardId = req.params.cardId;
    Card.remove({ _id: cardId })
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