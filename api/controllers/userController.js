const mongoose = require("mongoose");
const User = require("../models/users");
const UserDocument = require("../models/userDocuments");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");
const fs = require("fs");

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
                name: req.body.name,
                email: req.body.email,
                rDate: req.body.rDate,
                status: req.body.status,
                groups: req.body.groups,
                department: req.body.department,
                username: req.body.email,
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

module.exports.userUpdateInfo = [
  (req, res, next) => {
    try {
      function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var response = {};

        if (matches.length !== 3) {
          return new Error("Invalid input string");
        }

        response.type = matches[1];
        response.data = Buffer.from(matches[2], "base64");

        return response;
      }

      var imageTypeRegularExpression = /\/(.*?)$/;

      var crypto = require("crypto");
      var seed = crypto.randomBytes(20);
      var uniqueSHA1String = crypto
        .createHash("sha1")
        .update(seed)
        .digest("hex");

      if (req.body.avatar) {
        var base64Data = req.body.avatar;
        var imageBuffer = decodeBase64Image(base64Data);
        var userUploadedFeedMessagesLocation = "./uploads/";

        var uniqueRandomImageName = "image-" + uniqueSHA1String;
        var imageTypeDetected = imageBuffer.type.match(
          imageTypeRegularExpression
        );

        var userUploadedImagePath =
          userUploadedFeedMessagesLocation +
          uniqueRandomImageName +
          "." +
          imageTypeDetected[1];
        try {
          fs.writeFile(userUploadedImagePath, imageBuffer.data, function (err) {
            User.update({ _id: req.params.userId }, {
              $set: {
                name: req.body.name,
                avatar: uniqueRandomImageName + "." + imageTypeDetected[1],
                proxy: req.body.proxy
              }
            }, { upsert: true })
              .exec()
              .then(doc => {
                res.status(200).json({
                  messageType: 1,
                  message: "Bilgileriniz güncellendi.",
                  avatar: uniqueRandomImageName + "." + imageTypeDetected[1],
                  userName: req.body.fName + " " + req.body.lName
                });
              })
              .catch(err => {
                res.status(500).json({
                  messageType: -1,
                  message: "Bir hata oluştu.",
                  error: req.body.fName + " " + req.body.lName
                });
              });
          });


        } catch (error) {
          res.status(500).json({
            messageType: -1,
            message: "Bir hata oluştu.",
            error: error
          });
        }
      } else {
        User.update({ _id: req.params.userId }, {
          $set: {
            name: req.body.name,
            proxy: req.body.proxy
          }
        }, { upsert: true })
          .exec()
          .then(doc => {
            res.status(200).json({
              messageType: 1,
              message: "Bilgileriniz güncellendi.",
              userName: req.body.fName + " " + req.body.lName
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
    } catch (error) {
      res.status(500).json({
        messageType: -1,
        message: "Bir hata oluştu.",
        error: error
      });
    }
  }
];

module.exports.userUpdate = [
  checkAuth,
  (req, res, next) => {
    const userId = req.params.userId;
    User.update({ _id: userId }, { $set: req.body }, { upsert: true })
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
          header: [["Id", "Ad Soyad", "Email", "Durum", "Kayıt Tarihi"]],
          data: docs[0].data.map(x => [
            x._id,
            x.name,
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

module.exports.userByAuthSetId = [
  checkAuth,
  (req, res, next) => {
    let pageOptions = {
      page: req.body.page || 0,
      limit: req.body.limit || 2
    };
    User.aggregate([
      {
        $project: {
          _id: NumberInt(0),
          users: "$$ROOT"
        }
      },
      {
        $unwind: {
          path: "$users.groups",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          localField: "users._id",
          from: "authsetitems",
          foreignField: "ownerId",
          as: "authsetitems"
        }
      },
      {
        $lookup: {
          localField: "users.groups",
          from: "authsetitems",
          foreignField: "ownerId",
          as: "authsetitems2"
        }
      },
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  "authsetitems.authSet": {
                    $eq: mongoose.Types.ObjectId(req.params.authsetId)
                  }
                },
                {
                  "authsetitems2.authSet": {
                    $eq: mongoose.Types.ObjectId(req.params.authsetId)
                  }
                }
              ]
            },
            {
              $or: [
                { authsetitems: { $ne: [] } },
                { authsetitems2: { $ne: [] } }
              ]
            }
          ]
        }
      },
      {
        $project: {
          "users._id": 1,
          "users.name": 1,
          "users.email": 1
        }
      },
      {
        $group: {
          _id: {
            _id: "$users._id",
            name: "$users.name",
            email: "$users.email"
          }
        }
      },
      {
        $group: {
          _id: "$_id._id",
          name: { $first: "$_id.name" },
          email: { $first: "$_id.email" }
        }
      }
    ])
      .exec()
      .then(docs => {
        res.status(200).json(docs);
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
            groups: user[0].groups,
            name: user[0].name,
            token: token,
            avatar: user[0].avatar,
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

    userDocument
      .save()
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

/* yeni */

module.exports.userLogin_ = (req, res, next) => {
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
            user: {
              userId: user[0]._id,
              groups: user[0].groups,
              name: user[0].name,
              avatar: user[0].avatar,
            },
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

module.exports.userList_ = [
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
          columns: [
            {
              title: 'Adı Soyadı',
              dataIndex: 'name',
              width: 150
            },
            {
              title: 'Email',
              dataIndex: 'email',
              width: 250
            },
            {
              title: 'Durum',
              dataIndex: 'status',
              width: 80
            },
            {
              title: 'Kayıt Tarihi',
              dataIndex: 'rDate'
            }
          ],
          data: docs[0].data.map(x => {
            return {
              id: x._id,
              name: x.name,
              email: x.email,
              status: x.status == 1 ? "Aktif" : "Pasif",
              rDate: moment(x.rDate).format("YYYY-MM-DD HH:mm:ss")
            }
          }
          ),
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

module.exports.userGet_ = [
  checkAuth,
  (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
      .exec()
      .then(doc => {
        if (doc) {
          let form = [
            {
              name: "name",
              label: "Adı Soyadı",
              value: doc.name,
              placeholder: "Adınızı soyadınızı giriniz",
              type: "text",
              isRequired: true
            },
            {
              name: "email",
              label: "E-mail",
              value: doc.email,
              placeholder: "Email giriniz",
              type: "email",
              isRequired: true,
              isEmail: true
            },
            {
              name: "password",
              label: "Şifre",
              value: "",
              placeholder: "Şifrenizi giriniz",
              type: "password",
              isPassword: true
            },
            {
              name: "passwordre",
              label: "Şifre (Tekrar)",
              value: "",
              placeholder: "Şifrenizi tekrar giriniz",
              type: "password",
              isPassword: true,
              isEqual: "password"
            },
            {
              name: "title",
              label: "Ünvan",
              value: doc.title,
              placeholder: "Ünvan giriniz",
              type: "text"
            },
            {
              name: "department",
              label: "Departman",
              value: doc.department,
              placeholder: "Departman Seçiniz",
              type: "select",
              mode: "multiple",
              getprops: "departments",
              data: [
                { name: "Pazarlama", id: "1" },
                { name: "Satış", id: "2" },
                { name: "IT", id: "3" },
                { name: "Denetleme", id: "4" }
              ]
            },
            {
              name: "source",
              type: "text",
              value: "web",
              hidden: true
            }
          
          ]
          res.status(200).json({
            data:doc,
            form:form
          });
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