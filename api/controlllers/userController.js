const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/users');

module.exports.userAdd = (req, res, next) => {
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
        password: req.body.password
    });

    user.save().then(result => {
        res.status(201).json({
            message: "Kullanici kaydedildi.",
            messageType: 1,
            user: user
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });

    
};

module.exports.userUpdate = (req, res, next) => {
    const userId = req.params.userId;
    console.log(userId);
    const updateItems = {};
    for (const item of req.body) {
        updateItems[item.propname.toString()] = item.value;
    }
    console.log(updateItems);
    User.update({ _id: userId }, { $set: updateItems })
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
}

module.exports.userGet = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
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
}

module.exports.userList = (req, res, next) => {

    User.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

module.exports.userDelete = (req, res, next) => {
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

}