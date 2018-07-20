const mongoose = require('mongoose');
const Category = require('../models/categories');


module.exports.categoryAdd = (req, res, next) => {
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        rDate: req.body.rDate,
        description: req.body.description,
        parent: req.body.parent,
        childs: req.body.childs,
        sortIndex: req.body.sortIndex
    });

    category.save().then(result => {
        res.status(201).json({
            message: "Kategori kaydedildi.",
            messageType: 1,
            category: category
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
        console.log(err);
    });
};

module.exports.categoryUpdate = (req, res, next) => {
    const categoryId = req.params.categoryId;
    Category.update({ _id: categoryId }, { $set: req.body })
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

module.exports.categoryGet = (req, res, next) => {
    const categoryId = req.params.categoryId;
    Category.findById(categoryId)
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

module.exports.categoryList = (req, res, next) => {

    Category.find()
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

module.exports.categoryDelete = (req, res, next) => {
    const categoryId = req.params.categoryId;
    Category.remove({ _id: categoryId })
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