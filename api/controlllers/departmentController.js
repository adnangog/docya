const mongoose = require('mongoose');
const multer = require('multer');
const Department = require('../models/departments');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const upload = multer({ storage: storage });



module.exports.departmentAdd = [checkAuth,upload.single('departmentImage'), (req, res, next) => {
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

    
}];

module.exports.departmentUpdate = [checkAuth,(req, res, next) => {
    const departmentId = req.params.departmentId;
    Department.update({ _id: departmentId }, { $set: req.body })
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

module.exports.departmentGet = [checkAuth,(req, res, next) => {
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
}]

module.exports.departmentList = [checkAuth,(req, res, next) => {

    let pageOptions = {
        page: req.body.page || 0,
        limit: req.body.limit || 2
    }
    Department.aggregate([
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
                        "Departman Adı",
                        "Kayıt Tarihi",
                    ]
                ],
                "data": docs[0].data.map((x) => [
                    x._id,
                    x.name,
                    moment(x.rDate).format("YYYY-MM-DD HH:mm:ss")
                ]),
                "count":docs[0].info[0].count
            };
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}]

module.exports.departmentDelete = [checkAuth,(req, res, next) => {
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

}]