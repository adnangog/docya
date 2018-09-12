const mongoose = require("mongoose");
const User = require("../models/users");
const UserDocument = require("../models/userDocuments");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.userAdd = [
    (req, res, next) => {
        User.find({ email: req.body.email })
            .exec()
            .then(user => {
                if (user.length >= 1) {
                    return res.status(409).json({
                        message: "Bu mail adresi sistemde tanımlı",
                        messageType: 0
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                messageType: -1,
                                message: "Bir hata oluştu.",
                                error: err
                            });
                        } else {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                fName: req.body.fName,
                                lName: req.body.lName,
                                email: req.body.email,
                                rDate: req.body.rDate,
                                status: req.body.status,
                                roles: req.body.roles,
                                department: req.body.department,
                                username: req.body.username,
                                password: hash,
                                title: req.body.title,
                                position: req.body.position,
                                proxy: req.body.proxy,
                                source: req.body.source
                            });

                            user
                                .save()
                                .then(result => {
                                    res.status(201).json({
                                        message: "Kullanici kaydedildi.",
                                        messageType: 1,
                                        user: user
                                    });
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        messageType: -1,
                                        message: "Bir hata oluştu.",
                                        message: err.message
                                    });
                                });
                        }
                    });
                }
            })
            .catch();
    }
];

module.exports.userUpdate = [
    checkAuth,
    (req, res, next) => {
        const userId = req.params.userId;
        User.update({ _id: userId }, { $set: req.body })
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

module.exports.userGet = [
    checkAuth,
    (req, res, next) => {
        const userId = req.params.userId;
        User.findById(userId)
            .exec()
            .then(doc => {
                if (doc) {
                    res.status(200).json(doc);
                } else {
                    res.status(404).json({
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

module.exports.userList = [
    checkAuth,
    (req, res, next) => {
        let pageOptions = {
            page: req.body.page || 0,
            limit: req.body.limit || 2
        };
        User.aggregate([
            { $match: {} },
            {
                $facet: {
                    data: [
                        { $sort: { fName: -1 } },
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
                    header: [["Id", "Ad", "Soyad", "Email", "Durum", "Kayıt Tarihi"]],
                    data: docs[0].data.map(x => [
                        x._id,
                        x.fName,
                        x.lName,
                        x.email,
                        x.status == 1 ? "Aktif" : "Pasif",
                        moment(x.rDate).format("YYYY-MM-DD HH:mm:ss")
                    ]),
                    count: docs[0].info[0].count
                };
                // res.status(200).json(docs[0]);
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

module.exports.userDelete = [
    checkAuth,
    (req, res, next) => {
        const userId = req.params.userId;
        User.remove({ _id: userId })
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

module.exports.userLogin = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Login başarısız",
                    messageType: 0
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Login başarısız",
                        messageType: 0
                    });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        userId: user[0]._id,
                        userName: `${user[0].fName} ${user[0].lName}`,
                        token: token,
                        message: "Login başarılı",
                        messageType: 1
                    });
                }

                res.status(401).json({
                    message: "Login başarısız",
                    messageType: 0
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                messageType: -1,
                message: "Bir hata oluştu.",
                error: err
            });
        });
};

module.exports.userDocumentAdd = [
    (req, res, next) => {
        const userDocument = new UserDocument({
            _id: new mongoose.Types.ObjectId(),
            from: req.body.from,
            to: req.body.to,
            document: req.body.document,
            message: req.body.message,
            rDate: req.body.rDate,
            status: 1
        });

        userDocument.save()
            .then(result => {
                res.status(201).json({
                    message: "Döküman gönderildi",
                    messageType: 1
                });
            })
            .catch(err => {
                res.status(500).json({
                    messageType: -1,
                    message: JSON.stringify(err)
                });
            });
    }
];
