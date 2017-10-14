var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient:true});
var User = require('../model/user.js');
var Movie = require('../model/movies.js');

var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/', function (req, res) {
    if (req.body.password.length < 4) {
        res.status(400);
        res.json({errorMessage : 'ERROR : INSUFFICIENT DATA. Password too short.'});
        res.end();
    } else {
        var post = new User({
            last_name: req.body.lastname,
            middle_name: req.body.middlename,
            first_name: req.body.firstname,
            username: req.body.usern,
            passwords: req.body.password
        });

        post.save(function (err, result) {
            if (err) {

                if (err.errmsg !== undefined) {

                    if (err.errmsg.indexOf("duplicate") !== -1) {
                        res.status(409);
                        res.json({errorMessage: '409 CONFLICT - That username has already been taken'});
                    }
                } else if (err.message !== undefined) {

                    if (err.message.indexOf("required") !== -1) {
                        res.status(400);
                        res.json({
                            errorMessage: 'ERROR : INSUFFICIENT DATA : '
                            + err.message
                        });
                    }
                }
                res.json(err);
            } else {
                res.json(result);
            }
        });
    }
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
    User.find({}, {'_id': 0 , 'passwords': 0}, function (err, users) {
        if (err) {
            res.status(500);
            res.json({errorMessage: 'No list of users could be found in the database.'});
            return console.error(err);
        } else {
            res.json(users);
        }
    });
});

router.get('/user/:usern', function (req, res) {
    User.find({'username': req.params.usern}, {'_id':0, 'passwords':0}, function (err, users) {
        if (err) {
            res.status(500);
            res.json({errorMessage: 'No list of users could be found in the database.'});
            return console.error(err);
        } else if (users.length === 0) {
            res.status(404);
            res.json({errorMessage: 'ERROR : NO USER FOUND.'});
        } else {
            res.json(users);
        }
    })
});

router.get('/:limitresult', function (req, res) {
    if (isNaN(req.params.limitresult)) {
        res.status(400);
        res.json('Please enter a number to specify how many users you want to see.');
    } else {
        User.find({}, {'last_name': 1, 'first_name': 1, 'username': 1, '_id': 0}, function (err, users) {
            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of users could be found in the database.'});
                return console.error(err);
            } else {
                res.json(users);
            }
        }).limit(parseInt(req.params.limitresult));
    }
});

router.put('/favourites/:movie', function (req, res) {
    var tokenUsername = req.app.locals.decoded.username;
    console.log(tokenUsername);
    var userfound;

    function three(callback) {
        Movie.find({title: req.params.movie}, function (err, movies) {
            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of movies could be found in the database.'});
                return console.error(err);
            } else if (movies.length === 0) {
                res.status(500);
                res.json({errorMessage: 'You cannot add a movie that does not exist in our DB.'});
            } else {
                callback();
            }
        });
    }

    function one(callback) {
        User.find({'username': tokenUsername}, function (err, users) {
            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of users could be found in the database.'});
                return console.error(err);
            } else if (users.length === 0) {
                res.status(404);
                res.json({errorMessage: 'ERROR : NO USER FOUND.'});
            } else {
                // console.log(users);
                userfound = users[0];
                // console.log(userfound);
                callback();
            }
        });
    }

    //TODO: Maybe find a way to show the user that the movie, that he is trying to add is already in favourites.
    function two(smth, callback) {
        console.log(userfound);
        User.findByIdAndUpdate(userfound._id, { $addToSet: { favourites: req.params.movie}}, { new: true }, function (err, user) {
            if (err)
            {
                res.json(err);
            } else {
                res.json(user);
            }
        });
    }

    three(function () {
        one(function () {
            two(userfound, function () {

            })
        });
    })


});

module.exports = router;