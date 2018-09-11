const mongoose = require('mongoose');
const path = require('path');
const Mail = require('../models/mails');
const checkAuth = require("../middleware/checkAuth");
const moment = require("moment");

module.exports.mailAdd = [checkAuth, (req, res, next) => {
    
    var email = JSON.parse(req.body.mail);

    let totalItems = !!email.Attachments && email.Attachments.length || 0;


    totalItems > 0 && email.Attachments.map((x, i) => {

            const mail = new Mail({
                _id: new mongoose.Types.ObjectId(),
                from: email.From,
                to: email.To,
                cc: email.Cc,
                subject: email.Subject,
                message: email.Message,
                user: req.body.user,
                document: x.id
            });

            mail.save().then(result => {

                if (totalItems - i === 1) {
                    res.status(201).json({
                        message: "Mail(ler) kaydedildi.",
                        messageType: 1
                    });
                }
                

            }).catch(err => {
                res.status(500).json({
                    messageType: -1,
                    message: "Bir hata oluştu.",
                    error: err
                });
            });
    });


}];