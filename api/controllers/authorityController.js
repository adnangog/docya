const mongoose = require("mongoose");
const path = require("path");
const Authority = require("../models/authorities");
const AuthSet = require("../models/authSets");
const AuthSetItem = require("../models/authSetsItems");
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.authorityAdd = [
  checkAuth,
  (req, res, next) => {
    const authority = new Authority({
      _id: req.body._id,
      name: req.body.name,
      rDate: req.body.rDate
    });

    authority
      .save()
      .then(result => {
        res.status(201).json({
          message: "Yetki kaydedildi.",
          messageType: 1,
          authority: authority
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

module.exports.authorityUpdate = [
  checkAuth,
  (req, res, next) => {
    const authorityId = req.params.authorityId;
    Authority.update({ _id: authorityId }, { $set: req.body })
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

module.exports.authorityGet = [
  checkAuth,
  (req, res, next) => {
    const authorityId = req.params.authorityId;
    Authority.findById(authorityId)
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

module.exports.authorityList = [
  checkAuth,
  (req, res, next) => {
    let pageOptions = {
      page: req.body.page || 0,
      limit: req.body.limit || 2
    };
    Authority.aggregate([
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
          header: [["Id", "Yetki", "Kayıt Tarihi"]],
          data: docs[0].data.map(x => [
            x._id,
            x.name,
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

module.exports.authorityDelete = [
  checkAuth,
  (req, res, next) => {
    const authorityId = req.params.authorityId;
    Authority.remove({ _id: authorityId })
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

module.exports.authSetAdd = [
  checkAuth,
  (req, res, next) => {
    const authSet = new AuthSet({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      description: req.body.description,
      rDate: req.body.rDate,
      status: 1
    });

    authSet.save()
      .then(result => {
        let totalItems = (!!req.body.json && JSON.parse(req.body.json).length) || 0;

        totalItems > 0 &&
          JSON.parse(req.body.json).map((x, i) => {
            const authSetItem = new AuthSetItem({
              _id: new mongoose.Types.ObjectId(),
              authSet: authSet._id,
              type: x.type, //1- user 2- group
              ownerId: x.ownerId, // group or user _id
              name: x.name,
              authorities: x.authorities,
              status: 1,
              rDate: req.body.rDate
            });

            authSetItem.save()
              .then(result2 => {
                if (i == (totalItems - 1)) {
                  res.status(201).json({
                    message: "Yetki Seti kaydedildi.",
                    messageType: 1,
                    authSet: result2
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

module.exports.authSetUpdate = [
  checkAuth,
  (req, res, next) => {
    const authSetId = req.params.authSetId;
    AuthSet.update({ _id: authSetId }, {
      $set: {
        name: req.body.name,
        description: req.body.description
      }
    })
      .exec()
      .then(doc => {

        AuthSetItem.remove({ authSet: authSetId })
          .exec()
          .then(result => {
            let totalItems = (!!req.body.json && JSON.parse(req.body.json).length) || 0;

            totalItems > 0 &&
              JSON.parse(req.body.json).map((x, i) => {
                const authSetItem = new AuthSetItem({
                  _id: new mongoose.Types.ObjectId(),
                  authSet: authSetId,
                  type: x.type, //1- user 2- group
                  ownerId: x.ownerId, // group or user _id
                  name: x.name,
                  authorities: x.authorities,
                  status: 1,
                  rDate: req.body.rDate
                });

                authSetItem.save()
                  .then(result2 => {
                    if (i == (totalItems - 1)) {
                      res.status(201).json({
                        message: "Yetki Seti güncellendi.",
                        messageType: 1,
                        authSet: result2
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
              });
          })
          .catch(err => {
            res.status(500).json({
              messageType: -1,
              message: "Bir hata oluştu.",
              error: err
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
  }
];

module.exports.authSetGet = [
  checkAuth,
  (req, res, next) => {
    const authSetId = req.params.authSetId;
    AuthSet.findById(authSetId)
      .exec()
      .then(doc => {
        if (doc) {
          AuthSetItem.find({ "authSet": authSetId }).exec()
            .then(items => {
              res.status(200).json({
                "_id": doc._id,
                "name": doc.name,
                "description": doc.description,
                "json": items.map(x => {
                  return {
                    type: x.type,
                    name: x.name,
                    ownerId: x.ownerId,
                    authorities: x.authorities
                  }
                })
              });
            });

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

module.exports.authSetList = [
  checkAuth,
  (req, res, next) => {
    let pageOptions = {
      page: req.body.page || 0,
      limit: req.body.limit || 2
    };
    AuthSet.aggregate([
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
          header: [["Id", "Yetki Seti", "Açıklama", "Kayıt Tarihi"]],
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

module.exports.authSetDelete = [
  checkAuth,
  (req, res, next) => {
    const authSetId = req.params.authSetId;
    AuthSet.remove({ _id: authSetId })
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
