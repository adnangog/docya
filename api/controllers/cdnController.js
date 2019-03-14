const mongoose = require('mongoose');
const Mail = require('../models/mails');
const fs = require('fs');
const sharp = require('sharp');

module.exports.cdnGet = (req, res, next) => {
    fs.access('./uploads/' + req.params.fileName, fs.constants.F_OK, (err) => {
        if (err) {
          res.status(404).send('Not found');
        } else {

            let width = null;
            let height = null;

            if (req.query.width)
              width = parseInt(req.query.width);

            if (req.query.height)
              height = parseInt(req.query.height);

            const readStream = fs.createReadStream('./uploads/' + req.params.fileName);
            let transform = sharp()
              .resize(width, height);

            readStream.pipe(transform).pipe(res);
          
        }
      });
};