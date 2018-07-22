const mongoose = require("mongoose");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/checkAuth");

module.exports.userAdd = [checkAuth,(req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Bu mail adresi sistemde tanımlı",
                    messageType: 0
                });
            } else {

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            fName: req.body.fName,
                            lName: req.body.lName,
                            email: req.body.email,
                            rDate: req.body.rDate,
                            statu: req.body.statu,
                            roleId: req.body.roleId,
                            departmentId: req.body.departmentId,
                            authorities: req.body.authorities,
                            username: req.body.username,
                            password: hash
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
                                    messageType: 0,
                                    message: err.message
                                });
                                console.log(err);
                            });
                    }
                });

            }
        })
        .catch();
}];

module.exports.userUpdate = [checkAuth,(req, res, next) => {
    const userId = req.params.userId;
    User.update({ _id: userId }, { $set: req.body })
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
}];

module.exports.userGet = [checkAuth,(req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
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
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}];

module.exports.userList = [checkAuth,(req, res, next) => {
    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || parseInt(process.env.pageLimit)
    }
    User.find()
    .skip(pageOptions.page*pageOptions.limit)
    .limit(pageOptions.limit)
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}];

module.exports.userDelete = [checkAuth,(req, res, next) => {
    const userId = req.params.userId;
    User.remove({ _id: userId })
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
}];

module.exports.userLogin = (req, res, next) => {
    console.log(req.body);
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401)
                    .json({
                        message: "Login başarısız",
                        messageType: 0
                    });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401)
                        .json({
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
                    return res.status(200)
                        .json({
                            token:token,
                            message: "Login başarılı",
                            messageType: 1
                        });
                }

                res.status(401)
                    .json({
                        message: "Login başarısız",
                        messageType: 0
                    });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
