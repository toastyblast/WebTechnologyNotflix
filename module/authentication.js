var express = require('express');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient: true});
var User = require('../model/user.js');

var router = express.Router();

router.post('/', function (req, res) {
    if (req.body.username !== undefined && req.body.passwords !== undefined) {

        User.find({'username': req.body.username}, function (err, users) {
            if (err) return console.error(err);

            if (users.length > 0) {

                if (users[0].passwords === req.body.passwords) {
                    var token = jwt.sign({'username': req.body.username}, req.app.get('secretkey'), {
                        expiresIn: 86400 //86400 seconds equals 24 hours.
                    });

                    res.status(201);
                    res.json({'token': token})
                }
                else {
                    res.status(400);
                    res.json({errorMessage: '400 BAD REQUEST - Your username + password combination is wrong.'})
                }
            } else {
                res.status(404);
                res.json({errorMessage: '404 NOT FOUND - There is no user with that username'})
            }
        });
    } else {
        res.status(400);
        res.json({errorMessage: '400 BAD REQUEST - You are not defining certain required data (correctly).'})
    }
});

module.exports = router;