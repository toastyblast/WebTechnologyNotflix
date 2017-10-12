var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient: true});
var Rating = require('../model/ratings.js');
var jwt = require('jsonwebtoken');

var router = express.Router();

//Created ratings (On Yoran's Database):
// - tt_number = 123, username = 'martin', rating = 4.5
// - tt_number = 123, username = 'yoran', rating = 3.0
// - tt_number = 123, username = 'toasty', rating = 3.5
// - ...

// var post = new Rating({
//     tt_number: ???,
//     username: '???',
//     rating: ???.???
// });
//
// post.save(function (err, result) {
//     if (err) {
//         return console.error(err);
//     }
// });

router.get('/', function (req, res) {

    Rating.find({}, function (err, ratings) {

        if (err) {
            res.status(500);
            res.json({errorMessage: '500 SERVER-SIDE ERROR - No list of average ratings per movie could be found.'});
        }

        //TODO - ASK TEACHER: How to return the average rating sorted per movie in the same response.
        var amountOfRatings;
        var average = 0;

        for (amountOfRatings = 0; amountOfRatings < ratings.length; amountOfRatings++) {
            average += parseInt(ratings[amountOfRatings].rating);
        }

        average = Math.round((average / amountOfRatings) * 100) / 100;

        res.status(200);
        res.json({message: 'How to make this calculate the average for each movie and return it all in one JSON'});
    });
});

router.get('/:search', function (req, res) {
    var query = parseInt(req.params.search);

    if (isNaN(query) === false) {
        //The user is trying to get a movie by its tt_number, as they entered a number.
        Rating.find({'tt_number': query}, function (err, ratings) {

            if (err) {
                res.status(500);
                res.json({errorMessage: '500 SERVER-SIDE ERROR - No average ratings for the movie with this tt_number could be found.'});
                return;
            }

            if (ratings.length > 0) {
                var amountOfRatings;
                var average = 0;

                for (amountOfRatings = 0; amountOfRatings < ratings.length; amountOfRatings++) {
                    average += parseInt(ratings[amountOfRatings].rating);
                }

                average = Math.round((average / amountOfRatings) * 100) / 100;

                res.status(200);
                res.json({message: 'Average rating for the sought movie.', tt_number: query, averageRating: average});
            } else {
                res.status(404);
                res.json({errorMessage: '404 NOT FOUND - No ratings for a film with this tt_number can be found. Either it has no ratings or the movie does not exist.'});
            }
        })
    } else {
        //The user is searching on username, as they entered a String.
        query = req.params.search;

        var token = req.headers.authorization;

        jwt.verify(token, req.app.get("secretkey"), function (err, decoded) {
            if (err) {
                res.status(403);
                res.json({
                    errorMessage: 'FORBIDDEN - You do not have a token, meaning you are not logged in and therefore ' +
                    'not allowed to use this command.'
                });
            } else {
                var tokenUsername = decoded.username;

                if (tokenUsername === query) {
                    Rating.find({'username': query}, function (err, ratings) {
                        if (err) {
                            res.status(500);
                            res.json({errorMessage: '500 SERVER-SIDE ERROR - No list of ratings for this specific user can be found.'});
                            return;
                        }

                        if (ratings.length > 0) {
                            res.status(200);
                            res.json(ratings);
                        } else {
                            res.status(404);
                            res.json({errorMessage: '404 NOT FOUND - You have not made any ratings so far!'});
                        }
                    });
                } else {
                    //The user from the token isn't the same as the owner of this rating, so let the user not get it.
                    res.status(403);
                    res.json({errorMessage: '403 BAD REQUEST - You are not the owner of this rating and can therefore not view it.'})
                }
            }
        });
    }
});

// MIDDLEWARE FOR VERIFICATION
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

router.get('/:username/:tt_number', function (req, res) {
    //The user has filled in both a username (must be theirs) and a tt_number to get a review they made on a specific tt_number movie.
    var decoded = req.app.locals.decoded;
    var username = req.params.username;
    var tt_number = parseInt(req.params.tt_number);

    if (isNaN(username) && isNaN(tt_number) === false) {
        var tokenUsername = decoded.username;

        if (tokenUsername === username) {
            Rating.find({'username': username, 'tt_number': tt_number}, function (err, rating) {

                if (err) {
                    res.status(500);
                    res.json({errorMessage: '500 SERVER-SIDE ERROR - This specific rating of yours could not be found.'});
                    return;
                }

                if (rating.length > 0) {
                    res.status(200);
                    res.json(rating);
                } else {
                    res.status(404);
                    res.json({errorMessage: '404 NOT FOUND - You have no rating for a movie with the given tt_number, or that movie does not exist.'});
                }
            });
        } else {
            //The user from the token isn't the same as the owner of this rating, so let the user not get it.
            res.status(403);
            res.json({errorMessage: '403 BAD REQUEST - You are not the owner of this rating and can therefore not view.'})
        }
    } else {
        res.status(403);
        res.json({errorMessage: '403 BAD REQUEST - You should provide this command like: localhost:[port]/api/ratings/:username/:tt_number'})
    }
});

router.post('/', function (req, res) {
    //Needs a JSON file in the body with a tt_number, username and a rating of 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5 or 5.0
    //TODO: Check if the request's body is actually filled with correct data (400)

    var decoded = req.app.locals.decoded;
    var tokenUsername = decoded.username;

    if (tokenUsername === username) {
        //TODO: (also check if there isn't already a rating with this user and tt_number (409))

        res.send('Creates a rating with the sent data with the username in the token, if the user does not already have a rating on this movie!');
        res.status(201);
    } else {
        //The user from the token isn't the same as the owner of this rating, so let the user not delete it.
        res.status(403);
        res.json({errorMessage: '403 BAD REQUEST - You are not the owner of this rating and can therefore not change it.'})
    }
});

router.put('/', function (req, res) {
    //Needs a JSON with tt_number, username and rating OR a /:username & /:tt_number plus the new rating. ASK TEACHER.
    //TODO: check if there's both a username and a tt_number specified. Also check if the body has the right new rating parameter (403)

    //TODO: Check if the requested rating to update actually exists (404)
    var decoded = req.app.locals.decoded;
    var tokenUsername = decoded.username;

    if (tokenUsername === username) {
        //TODO:
        res.send('Updates a rating made by this user of the movie with the specified tt_number');
        res.status(200);
    } else {
        //The user from the token isn't the same as the owner of this rating, so let the user not delete it.
        res.status(403);
        res.json({errorMessage: '403 BAD REQUEST - You are not the owner of this rating and can therefore not change it.'})
    }
});

router.delete('/:username/:tt_number', function (req, res) {
    //The user has filled in both a username (must be theirs) and a tt_number to get a review they made on a specific tt_number movie.
    var decoded = req.app.locals.decoded;
    var username = req.params.username;
    var tt_number = parseInt(req.params.tt_number);

    if (isNaN(username) && isNaN(tt_number) === false) {
        var tokenUsername = decoded.username;

        if (tokenUsername === username) {
            //Check if the username from the token is the same as the one from the request, if so, continue.
            Rating.find({'username': username, 'tt_number': tt_number}, function (err, rating) {
                if (err) {
                    res.status(500);
                    res.json({errorMessage: '500 SERVER-SIDE ERROR - No list of average ratings per movie could be found.'});
                    return;
                }

                if (rating.length > 0) {

                    Rating.remove({'username': username, 'tt_number': tt_number}, function (err) {

                        if (err) return handleError(err);

                        res.status(200);
                        res.send('Rating has successfully been removed.');
                    });
                } else {
                    res.status(404);
                    res.json({errorMessage: '404 NOT FOUND - You have no rating for a movie with the given tt_number, or that movie does not exist.'});
                }
            });
        } else {
            //The user from the token isn't the same as the owner of this rating, so let the user not delete it.
            res.status(403);
            res.json({errorMessage: '403 BAD REQUEST - You are not the owner of this rating and can therefore not delete it.'})
        }
    } else {
        res.status(403);
        res.json({errorMessage: '403 BAD REQUEST - You should provide this command like: localhost:[port]/api/ratings/:username/:tt_number'})
    }
});

module.exports = router;