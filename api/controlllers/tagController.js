const mongoose = require('mongoose');
const path = require('path');
const Tag = require('../models/tags');

module.exports.tagAdd = (req, res, next) => {
    const tag = new Tag({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        tagId: req.body.tagId,
        rDate: req.body.rDate
    });

    tag.save().then(result => {
        res.status(201).json({
            message: "Etiket kaydedildi.",
            messageType: 1,
            tag: tag
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });

    
};

module.exports.tagUpdate = (req, res, next) => {
    const tagId = req.params.tagId;
    const updateItems = {};
    for (const item of req.body) {
        updateItems[item.propname.toString()] = item.value;
    }
    Tag.update({ _id: tagId }, { $set: updateItems })
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

module.exports.tagGet = (req, res, next) => {
    const tagId = req.params.tagId;
    Tag.findById(tagId)
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

module.exports.tagList = (req, res, next) => {

    Tag.find()
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

module.exports.tagDelete = (req, res, next) => {
    const tagId = req.params.tagId;
    Tag.remove({ _id: tagId })
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