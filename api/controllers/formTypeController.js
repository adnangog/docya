const mongoose = require('mongoose');
const path = require('path');
const FormType = require('../models/formTypes');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.formTypeAdd = [checkAuth, (req, res, next) => {
    const formType = new FormType({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        items: req.body.items,
        user: req.body.user,
        status: 1,
        rDate: req.body.rDate
    });

    formType.save().then(result => {
        res.status(201).json({
            message: "Tip kaydedildi.",
            messageType: 1,
            formType: formType
        });
    }).catch(err => {
        res.status(500).json({
            messageType: -1,
            message: "Bir hata oluştu.",
            error: err
        });
    });


}];

module.exports.formTypeUpdate = [checkAuth, (req, res, next) => {
    const formTypeId = req.params.formTypeId;
    FormType.update({ _id: formTypeId }, { $set: req.body })
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

module.exports.formTypeGet = [checkAuth, (req, res, next) => {
    const formTypeId = req.params.formTypeId;
    FormType.findById(formTypeId)
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
}]

module.exports.formTypeList = [checkAuth, (req, res, next) => {

    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }
    FormType.aggregate([
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
                    moment(x.rDate).formTypeat("YYYY-MM-DD HH:mm:ss")
                ]),
                "count": docs[0].info[0].count
            };
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

module.exports.formTypeDelete = [checkAuth, (req, res, next) => {
    const formTypeId = req.params.formTypeId;
    FormType.remove({ _id: formTypeId })
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