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
            formVersion: req.body.formVersion,
            organization: req.body.organization,
            calendar: req.body.calendar,
            steps:req.body.steps,
            rDate: req.body.rDate,
            status: 1
        });

        flowTemplate.save()
            .then(result => {
                res.status(201).json({
                    message: "Akış template'i kaydedildi.",
                    messageType: 1,
                    flowTemplate: result
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
            .populate('formVersion')
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
                            "Açıklama",
                            "Kayıt Tarihi"
                        ]
                    ],
                    data: docs[0].data.map(x => [
                        x._id,
                        x.name,
                        x.description,
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
