const express = require('express');
const path = require('path');
const documentRoute = require('./api/routes/documentRoute');
const userRoute = require('./api/routes/userRoute');
const folderRoute = require('./api/routes/folderRoute');
const authorityRoute = require('./api/routes/authorityRoute');
const roleRoute = require('./api/routes/roleRoute');
const cardRoute = require('./api/routes/cardRoute');
const documentCardRoute = require('./api/routes/documentCardRoute');
const departmentRoute = require('./api/routes/departmentRoute');
const transactionRoute = require('./api/routes/transactionRoute');
const tagRoute = require('./api/routes/tagRoute');
const formRoute = require('./api/routes/formRoute');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require('./api/models/db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

app.use('/document', documentRoute);
app.use('/user', userRoute);
app.use('/folder', folderRoute);
app.use('/authority', authorityRoute);
app.use('/role', roleRoute);
app.use('/card', cardRoute);
app.use('/documentcard', documentCardRoute);
app.use('/department', departmentRoute);
app.use('/transaction', transactionRoute);
app.use('/tag', tagRoute);
app.use('/form', formRoute);

app.listen(8000)