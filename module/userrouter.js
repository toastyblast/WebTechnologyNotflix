var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient: true});
var User = require('../model/user.js');
var Movie = require('../model/movies.js');

var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/', function (req, res) {

    //If the password is too short, don't allow the user to be registered.
    if (req.body.password.length < 4) {
        res.status(400);
        res.json({errorMessage: 'ERROR : INSUFFICIENT DATA. Password too short.'});
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
                    //If the username is already existing, send error.
                    if (err.errmsg.indexOf("duplicate") !== -1) {
                        res.status(409);
                        res.header("Access-Control-Allow-Origin", "*");
                        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                        res.json({errorMessage: '409 CONFLICT - That username has already been taken'});
                    }
                } else if (err.message !== undefined) {
                    //If one of the data is empty, send error.
                    if (err.message.indexOf("required") !== -1) {
                        res.status(400);
                        res.header("Access-Control-Allow-Origin", "*");
                        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                        res.json({
                            errorMessage: 'ERROR : INSUFFICIENT DATA : '
                            + err.message
                        });
                    }
                }
            } else {
                res.status(201);
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.json(result);
            }
        });
    }
});

//Middleware to authenticate the user as being a logged in one.
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
    //Show all the users without showing the id and password.
    User.find({}, {'_id': 0, 'passwords': 0}, function (err, users) {

        if (err) {
            res.status(500);
            res.json({errorMessage: 'No list of users could be found in the database.'});

            return console.error(err);
        } else {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.json(users);
        }
    });
});

router.get('/user/:usern', function (req, res) {
    //Show a user that matches the username in the url.
    //If the user is not found send 404 error.
    User.find({'username': req.params.usern}, {'_id': 0, 'passwords': 0}, function (err, users) {

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
    //Send the amount of users that was specified in the url.
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

    //Find the movie that the user is trying to favourite.
    //If it doesn't exist send 404 error.
    function findMovie(callback) {

        Movie.find({title: req.params.movie}, function (err, movies) {

            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of movies could be found in the database.'});

                return console.error(err);
            } else if (movies.length === 0) {
                res.status(404);
                res.json({errorMessage: 'You cannot add a movie that does not exist in our DB.'});
            } else {
                callback();
            }
        });
    }

    //Find the user that is sending the token.
    //If the username that is received from the token is not in the DB, then send 404 error.
    function findUser(callback) {

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

    function addFavourite(smth, callback) {
        console.log(userfound);

        //Add the movie to the user's favourite. A movie can only be added once, because we are using $addToSet.
        User.findByIdAndUpdate(userfound._id, {$addToSet: {favourites: req.params.movie}}, {new: true}, function (err, user) {

            if (err) {
                res.json(err);
            } else {
                res.json(user);
            }
        });
    }

    findMovie(function () {

        findUser(function () {

            addFavourite(userfound, function () {
                //Now return...
            })
        });
    })
});

module.exports = router;