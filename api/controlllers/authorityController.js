const mongoose = require('mongoose');
const path = require('path');
const Authority = require('../models/authorities');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.authorityAdd = [checkAuth, (req, res, next) => {
    const authority = new Authority({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
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
}];

module.exports.authorityUpdate = [checkAuth, (req, res, next) => {
    const authorityId = req.params.authorityId;
    Authority.update({ _id: authorityId }, { $set: req.body })
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

module.exports.authorityGet = [checkAuth, (req, res, next) => {
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
}]

module.exports.authorityList = [checkAuth, (req, res, next) => {
    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }
    Authority.aggregate([
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
                        "Yetki",
                        "Kayıt Tarihi"
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

module.exports.authorityDelete = [checkAuth, (req, res, next) => {
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

}]