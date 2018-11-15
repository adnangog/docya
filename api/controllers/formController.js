const mongoose = require('mongoose');
const path = require('path');
const Form = require('../models/forms');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.formAdd = [checkAuth, (req, res, next) => {
    const form = new Form({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        formType: req.body.formType,
        fields: req.body.fields,
        user: req.body.user,
        status: 1,
        rDate: req.body.rDate
    });

    form.save().then(result => {
        res.status(201).json({
            message: "Form kaydedildi.",
            messageType: 1,
            form: form
        });
    }).catch(err => {
        res.status(500).json({
            messageType: -1,
            message: "Bir hata oluştu.",
            error: err
        });
    });


}];

module.exports.formUpdate = [checkAuth, (req, res, next) => {
    const formId = req.params.formId;
    Form.update({ _id: formId }, { $set: req.body })
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

module.exports.formGet = [checkAuth, (req, res, next) => {
    const formId = req.params.formId;
    Form.findById(formId)
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

module.exports.formList = [checkAuth, (req, res, next) => {

    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }
    Form.aggregate([
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

module.exports.formDelete = [checkAuth, (req, res, next) => {
    const formId = req.params.formId;
    Form.remove({ _id: formId })
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