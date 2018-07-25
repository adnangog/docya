const mongoose = require('mongoose');
const path = require('path');
const Tag = require('../models/tags');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.tagAdd = [checkAuth,(req, res, next) => {
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

    
}];

module.exports.tagUpdate = [checkAuth,(req, res, next) => {
    const tagId = req.params.tagId;
    Tag.update({ _id: tagId }, { $set: req.body })
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

module.exports.tagGet = [checkAuth,(req, res, next) => {
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
}]

module.exports.tagList = [checkAuth,(req, res, next) => {

    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }
    Tag.aggregate([
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
                        "Kayıt Tarihi",
                    ]
                ],
                "data": docs[0].data.map((x) => [
                    x._id,
                    x.name,
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

module.exports.tagDelete = [checkAuth,(req, res, next) => {
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

}]