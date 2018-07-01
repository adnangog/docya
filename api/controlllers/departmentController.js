const mongoose = require('mongoose');
const path = require('path');
const Department = require('../models/departments');

module.exports.departmentAdd = (req, res, next) => {
    console.log(
        req.body
    );
    const department = new Department({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        rDate: req.body.rDate
    });

    department.save().then(result => {
        res.status(201).json({
            message: "Departman kaydedildi.",
            messageType: 1,
            department: department
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });

    
};

module.exports.departmentUpdate = (req, res, next) => {
    const departmentId = req.params.departmentId;
    const updateItems = {};
    for (const item of req.body) {
        updateItems[item.propname.toString()] = item.value;
    }
    Department.update({ _id: departmentId }, { $set: updateItems })
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

module.exports.departmentGet = (req, res, next) => {
    const departmentId = req.params.departmentId;
    Department.findById(departmentId)
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

module.exports.departmentList = (req, res, next) => {

    Department.find()
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

module.exports.departmentDelete = (req, res, next) => {
    const departmentId = req.params.departmentId;
    Department.remove({ _id: departmentId })
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