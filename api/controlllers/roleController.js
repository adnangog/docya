const mongoose = require('mongoose');
const path = require('path');
const Role = require('../models/roles');
const checkAuth = require("../middleware/checkAuth");

module.exports.roleAdd = [checkAuth,(req, res, next) => {
    const role = new Role({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        authorities: req.body.authorities,
        rDate: req.body.rDate
    });

    role.save().then(result => {
        res.status(201).json({
            message: "Rol kaydedildi.",
            messageType: 1,
            role: role
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });

}];

module.exports.roleUpdate = [checkAuth,(req, res, next) => {
    const roleId = req.params.roleId;

    Role.update({ _id: roleId }, { $set: req.body })
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

module.exports.roleGet = [checkAuth,(req, res, next) => {
    const roleId = req.params.roleId;
    Role.findById(roleId)
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

module.exports.roleList = [checkAuth,(req, res, next) => {

    Role.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}]

module.exports.roleDelete = [checkAuth,(req, res, next) => {
    const roleId = req.params.roleId;
    Role.remove({ _id: roleId })
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