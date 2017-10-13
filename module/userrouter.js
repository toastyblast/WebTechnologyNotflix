var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient:true});
var User = require('../model/user.js');
var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/', function (req, res) {
    //TODO: Make the code check if there isn't already a user with this username. The err doesn't include this. (I managed to make 2 of the same user by posting the same command twice with the same body.)

    var post = new User({
        last_name: req.body.lastname ,
        middle_name: req.body.middlename,
        first_name : req.body.firstname,
        username: req.body.usern,
        passwords: req.body.password
    });

    post.save(function (err, result) {
        if (err) {
            // return console.error(err);
            res.status(500);
            res.json("500 SERVER - User not added because of an internal server issue or a wrong body in the request.")
        } else {
            res.status(201);
            res.json(post);
        }
    });
});

router.use(function (req, res, next) {
    var token = req.headers.authorization;

    jwt.verify(token, req.app.get("secretkey"), function (err, decoded) {
        if (err) {
            res.status(403);
            res.json({
                errorMessage: 'FORBIDDEN - You do not have a token, meaning you are not logged in and therefore ' +
                'not allowed to use this command.'
            });
        } else {
            req.app.locals.decoded = decoded;
            next();
        }
    });
});

router.get('/', function (req, res) {
    User.find({}, {'_id': 0, 'passwords': 0, '__v' : 0}, function (err, users) {
        if (err) return console.error(err);

        res.json(users);
    });
});

router.get('/:usern', function (req, res) {
    User.find({'username': req.params.usern}, {'_id': 0, 'passwords': 0, '__v' : 0}, function (err, users) {
        if (err) return console.error(err);
        res.json(users);
    })
});

module.exports = router;