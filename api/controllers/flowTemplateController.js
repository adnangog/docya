const mongoose = require("mongoose");
const FlowTemplate = require("../models/flowTemplates");
const Transaction = require('../models/transactions');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.flowTemplateAdd = [
    checkAuth,
    (req, res, next) => {
        const flowTemplate = new FlowTemplate({
            _id: new mongoose.Types.ObjectId(),
            parentId: req.body.parentId,
            name: req.body.name,
            authSet: req.body.authSet,
            user: req.body.user,
            type: req.body.type,
            form: req.body.form,
            formVer: req.body.formVer,
            schema: req.body.schema,
            calendar: req.body.calendar,
            steps:req.body.steps,
            rDate: req.body.rDate,
            status: 1
        });

        flowTemplate.save()
            .then(res => {

                res.status(201).json({
                    message: "Akış template'i kaydedildi.",
                    messageType: 1,
                    flowTemplate: flowTemplate
                });

            })
            .catch(err => {
                res.status(500).json({
                    messageType: -1,
                    message: "Bir hata oluştu.",
                    error: err
                });
            });
    }
];

module.exports.flowTemplateUpdate = [
    checkAuth,
    (req, res, next) => {
        const flowTemplateId = req.params.flowTemplateId;
        FlowTemplate.update({ _id: flowTemplateId }, { $set: req.body })
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
    }
];

module.exports.flowTemplateGet = [
    checkAuth,
    (req, res, next) => {
        const flowTemplateId = req.params.flowTemplateId;
        FlowTemplate.findById(flowTemplateId)
            .exec()
            .then(doc => {
                if (doc) {
                    res.status(200).json(doc);
                } else {
                    res
                        .status(404)
                        .json({
                            message: "Bu id'ye ait bir kayit bulunamadi.",
                            messageType: 0
                        });
                }
            })
            .catch(err => {
                res.status(500).json({
                    messageType: -1,
                    message: "Bir hata oluştu.",
                    error: err
                });
            });
    }
];

module.exports.flowTemplateList = [
    checkAuth,
    (req, res, next) => {
        let pageOptions = {
            page: req.body.page || 0,
            limit: req.body.limit || 2
        };
        FlowTemplate.aggregate([
            { $match: {} },
            {
                $lookup: {
                    from: "cards",
                    localField: "card",
                    foreignField: "_id",
                    as: "card"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "flowTemplates",
                    localField: "parent",
                    foreignField: "_id",
                    as: "parent"
                }
            },
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
        ])
            .exec()
            .then(docs => {
                let data = {
                    header: [
                        [
                            "Id",
                            "Adı",
                            "Üst Klasör",
                            "Ekleyen",
                            "Kart",
                            "Açıklama",
                            "Durum",
                            "Kayıt Tarihi"
                        ]
                    ],
                    data: docs[0].data.map(x => [
                        x._id,
                        x.name,
                        x.parent.length > 0 ? x.parent[0].name : [],
                        x.user.length > 0 ? `${x.user[0].fName} ${x.user[0].lName}` : [],
                        x.card.length > 0 ? x.card[0].name : [],
                        x.description,
                        x.status === 1 ? "Aktif" : "Pasif",
                        moment(x.rDate).format("YYYY-MM-DD HH:mm:ss")
                    ]),
                    count: docs[0].info[0].count
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
    }
];

module.exports.flowTemplateDelete = [
    checkAuth,
    (req, res, next) => {
        const flowTemplateId = req.params.flowTemplateId;
        FlowTemplate.remove({ _id: flowTemplateId })
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
    }
];
