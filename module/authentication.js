var express = require('express');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient: true});
var User = require('../model/user.js');

var router = express.Router();

router.post('/', function (req, res) {
    if (req.body.username !== undefined && req.body.passwords !== undefined) {
        //Check if the body has been defined right.
        User.find({'username': req.body.username}, function (err, users) {
            if (err) return console.error(err);

            if (users.length > 0) {
                //Check if there are actually any users with this username.
                if (users[0].passwords === req.body.passwords) {
                    //Then check if this username and password combination is right.
                    var token = jwt.sign({'username': req.body.username}, req.app.get('secretkey'), {
                        expiresIn: 2419200 //2419200 seconds equals 4 weeks.
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

router.post('/check', function (req, res) {
    var token = req.body.token;

    jwt.verify(token, req.app.get("secretkey"), function (err, decoded) {
        //Verify the token the user sent back to you.
        if (err) {
            res.status(403);
            res.json({
                errorMessage: '403 FORBIDDEN - This token has expired.'
            });
        } else {
            res.status(200);
            res.json({
                tokenUsername: "" + decoded.username,
                errorMessage: '200 OK - This token has not expired.'
            });
        }
    });
});

module.exports = router;