var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient:true});
var Rating = require('../model/ratings.js');
var jwt = require('jsonwebtoken');

var router = express.Router();
var app = express();

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
            res.json({errorMessage:'500 SERVER-SIDE ERROR - No list of average ratings per movie could be found.'});
        }

        //TODO - ASK TEACHER: How to return the average rating sorted per movie in the same response.
        var amountOfRatings;
        var average = 0;

        for (amountOfRatings = 0;amountOfRatings < ratings.length; amountOfRatings++) {
            average += parseInt(ratings[amountOfRatings].rating);
        }

        average = Math.round((average / amountOfRatings) * 100) / 100;

        res.status(200);
        res.json({message:'How to make this calculate the average for each movie and return it all in one JSON'});
    });
});

router.get('/:search', function (req, res) {
    //The user is trying to get a movie by its tt_number
    var query = parseInt(req.params.search);

    if (isNaN(query) === false) {

        Rating.find({'tt_number': query}, function (err, ratings) {

            if (err) {
                res.status(500);
                res.json({errorMessage:'500 SERVER-SIDE ERROR - No list of average ratings per movie could be found.'});
                return;
            }

            if (ratings.length > 0) {
                var amountOfRatings;
                var average = 0;

                for (amountOfRatings = 0;amountOfRatings < ratings.length; amountOfRatings++) {
                    average += parseInt(ratings[amountOfRatings].rating);
                }

                average = Math.round((average / amountOfRatings) * 100) / 100;

                res.status(200);
                res.json({message:'Average rating for the sought movie.',tt_number:query, averageRating:average});
            } else {
                res.status(404);
                res.json({errorMessage:'404 NOT FOUND - No ratings for a film with this tt_number can be found. Either it has no ratings or the movie does not exist.'});
            }
        })

        //TODO: Add trying to find a movie by database ID(aka index).
    } else {
        query = req.params.search;

        var token = req.headers['authorization'];

        jwt.verify(token, app.get('secret-key'), function (err, decoded) {
            if (err) {
                res.status(403);
                res.json({errorMessage:'FORBIDDEN - You do not have a token, meaning you are not logged in and therefore ' +
                'not allowed to use this command.'});
            } else {
                //TODO: Check if the query filled in is the logged-in user's username. If so, return a list of all their ratings.

                Rating.find({'username':query}, function (err, ratings) {
                    if (err) {
                        res.status(500);
                        res.json({errorMessage:'500 SERVER-SIDE ERROR - No list of average ratings per movie could be found.'});
                        return;
                    }

                    if (ratings.length > 0) {
                        res.status(200);
                        res.json(ratings);
                    } else {
                        res.status(404);
                        res.json({errorMessage:'404 NOT FOUND - You have not made any ratings so far!'});
                    }
                });
            }
        });

        res.status(403);
        res.json({errorMessage:'403 BAD REQUEST - You filled in characters where this command only takes numbers for either a tt_number or an movie index.'});
    }
});

//TODO: Use middleware to do the authentication at this point. Yoran, ask teacher how to do this.

router.get('/:username/:tt_number', function (req, res) {
    var token = req.headers['authorization'];

    jwt.verify(token, app.get('secret-key'), function (err, decoded) {
        if (err) {
            res.status(403);
            res.json({errorMessage:'FORBIDDEN - You do not have a token, meaning you are not logged in and therefore ' +
            'not allowed to use this command.'});
        } else {
            //The user has filled in both a username (must be theirs) and a tt_number to get a review they made on a specific tt_number movie.
            var username = req.params.username;
            var tt_number = parseInt(req.params.tt_number);

            if (isNaN(username) && isNaN(tt_number) === false) {
                //TODO: Check for if there's a username query as well as a tt_number here and the username of the user matches
                // TODO: the logged in user's token decoded. If so, return the user's rating on the movie with this tt_number, if they have one.

                Rating.find({'username': username, 'tt_number': tt_number}, function (err, rating) {

                    if (err) {
                        res.status(500);
                        res.json({errorMessage: '500 SERVER-SIDE ERROR - No list of average ratings per movie could be found.'});
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
                res.status(403);
                res.json({errorMessage: '403 BAD REQUEST - You should provide this command like: localhost:[port]/api/ratings/:username/:tt_number'})
            }
        }
    });
});

router.post('/', function (req, res) {
    //Needs a JSON file in the body with a tt_number, username and a rating of 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5 or 5.0

    var token = req.headers['authorization'];

    jwt.verify(token, app.get('secret-key'), function (err, decoded) {
        if (err) {
            res.status(403);
            res.json({errorMessage:'FORBIDDEN - You do not have a token, meaning you are not logged in and therefore ' +
            'not allowed to use this command.'});
        } else {
            //TODO: (also check if the request's body is actually filled with correct data (400) or if it already exists (409) and if the user trying to create the rating is the one with the token (403))

            res.send('Creates a rating with the sent data with the username in the token, if the user does not already have a rating on this movie!');
            res.status(201);
        }
    });
});

router.put('/', function (req, res) {
    //Needs a JSON with tt_number, username and rating OR a /:username & /:tt_number plus the new rating. ASK TEACHER.

    //TODO: check if there's both a username and a tt_number specified. Also check if the body has the right new rating parameter (403)

    var token = req.headers['authorization'];

    jwt.verify(token, app.get('secret-key'), function (err, decoded) {
        if (err) {
            res.status(403);
            res.json({errorMessage:'FORBIDDEN - You do not have a token, meaning you are not logged in and therefore ' +
            'not allowed to use this command.'});
        } else {
            //TODO: (also check if the requested rating to update actually exists (404) or if it's actually owned by this user (403))
            res.send('Updates a rating made by this user of the movie with the specified tt_number');
            res.status(200);
        }
    });
});

router.delete('/:username/:tt_number', function (req, res) {
    var token = req.headers['authorization'];

    jwt.verify(token, app.get('secret-key'), function (err, decoded) {
        if (err) {
            res.status(403);
            res.json({errorMessage:'FORBIDDEN - You do not have a token, meaning you are not logged in and therefore ' +
            'not allowed to use this command.'});
        } else {
            //The user has filled in both a username (must be theirs) and a tt_number to get a review they made on a specific tt_number movie.
            var username = req.params.username;
            var tt_number = parseInt(req.params.tt_number);

            if (isNaN(username) && isNaN(tt_number) === false) {
                //TODO: Check if the requested rating is actually owned by this authorized user (403)

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
                res.status(403);
                res.json({errorMessage: '403 BAD REQUEST - You should provide this command like: localhost:[port]/api/ratings/:username/:tt_number'})
            }
        }
    });
});

module.exports = router;