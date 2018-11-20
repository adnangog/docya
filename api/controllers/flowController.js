const mongoose = require("mongoose");
const Flow = require("../models/flows");
const FlowTemplate = require("../models/flowTemplates");
const Transaction = require('../models/transactions');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");
const helper = require("../helpers/index");

module.exports.flowAdd = [
    checkAuth,
    (req, res, next) => {
        FlowTemplate.findById(req.body.flowTemplate)
            .exec()
            .then(doc => {
                if (doc) {
                    const flow = new Flow({
                        _id: new mongoose.Types.ObjectId(),
                        flowTemplate: req.body.flowTemplate,
                        name: req.body.name,
                        authSet: doc.authSet,
                        user: req.body.user,
                        type: doc.type,
                        form: doc.form,
                        formVersion: doc.formVersion,
                        fields: req.body.fields,
                        organization: doc.organization,
                        steps: doc.steps,
                        rDate: Date.now(),
                        status: 1,
                        currentStep: 1
                    });

                    flow.save()
                        .then(flow => {
                            res.status(201).json({
                                message: "Akış kaydedildi.",
                                messageType: 1,
                                flow: flow
                            });

                        })
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
    }
];

module.exports.flowUpdate = [
    checkAuth,
    (req, res, next) => {
        const flowId = req.params.flowId;
        Flow.update({ _id: flowId }, { $set: req.body })
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

module.exports.flowGet = [
    checkAuth,
    (req, res, next) => {
        const flowId = req.params.flowId;
        Flow.findById(flowId)
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

module.exports.flowList = [
    checkAuth,
    (req, res, next) => {
        let pageOptions = {
            page: req.body.page || 0,
            limit: req.body.limit || 2
        };

        let query = {};

        if (req.body.flowTemplate) {
            query = { "flowTemplate": mongoose.Types.ObjectId(req.body.flowTemplate) }
        }

        Flow.aggregate([
            { $match: query },
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
                    from: "flowtemplates",
                    localField: "flowTemplate",
                    foreignField: "_id",
                    as: "flowTemplate"
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
                            "Template",
                            "Başlatan",
                            "Durum",
                            "Kayıt Tarihi"
                        ]
                    ],
                    data: docs[0].data.map(x => [
                        x._id,
                        x.name,
                        x.flowTemplate.length > 0 ? x.flowTemplate[0].name : [],
                        x.user.length > 0 ? `${x.user[0].fName} ${x.user[0].lName}` : [],
                        x.status === 1 ? "Devam Ediyor" : x.status === 2 ? "Bitti" : "İptal",
                        moment(x.rDate).format("YYYY-MM-DD HH:mm:ss"),
                        x.fields // cIndex degiskeni degerini bu itemin indexinden aliyor.
                    ]),
                    count: docs[0].info.length > 0 ? docs[0].info[0].count : 0
                };

                let cIndex = 6;

                if (docs[0].data.length > 0) {
                    !!docs[0].data[0].fields && Object.keys(docs[0].data[0].fields[0]).map(x => data.header[0].push(helper.cHeaderText(x)));

                    data.data.map((d, i) => {
                        if (!!d[cIndex]) {
                            Object.keys(d[cIndex][0]).map(f => d.push(d[cIndex][0][f]));
                            d.splice(cIndex, 1)
                        }
                    });
                }

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

module.exports.flowDelete = [
    checkAuth,
    (req, res, next) => {
        const flowId = req.params.flowId;
        Flow.remove({ _id: flowId })
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

var flowController = (currentStep, steps, ) => {
    var step = steps.filter(function (a) {
        return a.sortIndex === currentStep
    });
    if (step.length > 0 && step[0].type !== "manual" && step[0].type !== "end") {
        console.log(step[0].id);
        step[0].statu = 1;
        flowController(step[0].sortIndex + 1, steps);
    }
    return steps;
}
