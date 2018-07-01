const mongoose = require('mongoose');
const path = require('path');
const Authority = require('../models/authorities');

module.exports.authorityAdd = (req, res, next) => {
    console.log(
        req.body
    );
    const authority = new Authority({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        aId: req.body.aId,
        rDate: req.body.rDate
    });

    authority.save().then(result => {
        res.status(201).json({
            message: "Yetki kaydedildi.",
            messageType: 1,
            authority: authority
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });
};

module.exports.authorityUpdate = (req, res, next) => {
    const authorityId = req.params.authorityId;
    const updateItems = {};
    for (const item of req.body) {
        updateItems[item.propname.toString()] = item.value;
    }
    Authority.update({ _id: authorityId }, { $set: updateItems })
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

module.exports.authorityGet = (req, res, next) => {
    const authorityId = req.params.authorityId;
    Authority.findById(authorityId)
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

module.exports.authorityList = (req, res, next) => {

    Authority.find()
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

module.exports.authorityDelete = (req, res, next) => {
    const authorityId = req.params.authorityId;
    Authority.remove({ _id: authorityId })
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