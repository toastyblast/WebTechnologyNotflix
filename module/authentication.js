var express = require('express');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient:true});
var User = require('../model/user.js');

var router = express.Router();

router.post('/', function (req, res) {
    //TODO: Check if the username + password combo is right.

    var token = jwt.sign({'username':req.headers.username}, req.app.get('secretkey'), {
        expiresIn: 86400 //Might crash the server, so left commented out for now.
    });

    res.status(201);
    res.json({'token':token})
});

module.exports = router;