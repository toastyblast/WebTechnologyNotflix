var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/Notflix', {useMongoClient: true});
var Movie = require('../model/movies.js');
var Rating = require('../model/ratings.js');

var router = express.Router();

router.get('/', function (req, res) {
    var jsonString = '{"theAverageRatings":[]}';
    var obj = JSON.parse(jsonString);

    // callback when all your Rating.find() are complete
    function done(obj) {
        res.status(200);
        res.json(obj);
    }

    // get the movies
    Movie.find({}, function (err, movies) {
        if (err) {
            res.status(500);
            res.json({errorMessage: '500 SERVER-SIDE ERROR - No list of movies to get the average ratings of could be found.'});
        }
        // loop over the results
        movies.forEach(function (movie, i) {
            // get the Rating for this Movie
            Rating.find({'tt_number': movie.tt_number}, function (err, movieRatings) {
                if (err) {
                    res.status(500);
                    res.json({errorMessage: '500 SERVER-SIDE ERROR - No list of average ratings for this movie could be found.'});
                    return;
                }

                if (movieRatings.length > 0) {
                    //If it has ratings, calculate the average rating.
                    var amountOfRatings;
                    var average = 0;

                    for (amountOfRatings = 0; amountOfRatings < movieRatings.length; amountOfRatings++) {
                        average += parseInt(movieRatings[amountOfRatings].rating);
                    }

                    average = Math.round((average / amountOfRatings) * 100) / 100;

                    //Add the average rating for this movie to the response jsonString.
                    obj["theAverageRatings"].push({
                        averageRatingMessage: 'Movie with tt_number = [' + movie.tt_number + '] has the following average rating.',
                        averageRating: average,
                        movie_tt_number: movie.tt_number
                    });
                } else {
                    //Add a notice that this movie does not have any ratings and therefore no average rating either to the response jsonString.
                    obj["theAverageRatings"].push({
                        noRatingMessage: 'Movie with tt_number = [' + movie.tt_number + "] has no ratings yet.",
                        movie_tt_number: movie.tt_number
                    });
                }

                // this is the last one, call done()
                if (movies.length - 1 === i) {
                    done(obj);
                }
            });
        })
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
                //Check if the result isn't empty, aka the movie has no ratings.
                var amountOfRatings;
                var average = 0;

                for (amountOfRatings = 0; amountOfRatings < ratings.length; amountOfRatings++) {
                    average += parseInt(ratings[amountOfRatings].rating);
                }

                average = Math.round((average / amountOfRatings) * 100) / 100;

                res.status(200);
                res.json({
                    confirmationMessage: '200 OK - Average rating for the sought movie has been retrieved.',
                    tt_number: query,
                    averageRating: average
                });
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
            //Verify the token the user sent back to you.
            if (err) {
                res.status(403);
                res.json({
                    errorMessage: '403 FORBIDDEN - You do not have a token, meaning you are not logged in and therefore ' +
                    'not allowed to use this command.'
                });
            } else {
                var tokenUsername = decoded.username;

                if (tokenUsername === query) {
                    //Check if the user should be allowed to see the list of ratings made by a user, if they are that user.
                    Rating.find({'username': query}, function (err, ratings) {
                        if (err) {
                            res.status(500);
                            res.json({errorMessage: '500 SERVER-SIDE ERROR - No list of ratings for this specific user can be found.'});
                            return;
                        }

                        if (ratings.length > 0) {
                            //Check if there's actually something in the resulting list.
                            res.status(200);
                            res.json(ratings);
                        } else {
                            res.status(404);
                            res.json({errorMessage: '404 NOT FOUND - You have not made any ratings so far!'});
                        }
                    });
                } else {
                    //The user from the token isn't the same as the owner of this rating, so let the user not get it.
                    res.status(400);
                    res.json({errorMessage: '400 BAD REQUEST - You are not the owner of this rating and can therefore not view it.'})
                }
            }
        });
    }
});

// MIDDLEWARE FOR VERIFICATION OF THE USER'S TOKEN
// Fun fact about middleware: It only applies onto all routings under it, and not also the ones above it.
router.use(function (req, res, next) {
    var token = req.headers.authorization;

    jwt.verify(token, req.app.get("secretkey"), function (err, decoded) {
        //Verify the token the user sent back to you.
        if (err) {
            res.status(403);
            res.json({
                errorMessage: '403 FORBIDDEN - You do not have a valid token, meaning you are not logged in and ' +
                'therefore not allowed to use this command.'
            });
        } else {
            //If so, store the decoded information for use by the commands under this middleware.
            req.app.locals.decoded = decoded;
            next();
        }
    });
});

router.get('/:username/:tt_number', function (req, res) {
    //The user has filled in both a username (must be theirs) and a tt_number to get a review they made on a specific tt_number movie.
    var decoded = req.app.locals.decoded;
    var username = req.params.username;
    var imdb_tt_number = req.params.tt_number;
    // var tt_number = parseInt(req.params.tt_number);

    if (isNaN(username) && isNaN(imdb_tt_number)) {
        var tokenUsername = decoded.username;

        if (tokenUsername === username) {
            //Check if the authorized user is the user they are requesting to see.
            Rating.find({'username': username, 'imdb_tt_number': imdb_tt_number}, {'_id': 0, '__v': 0}, function (err, rating) {

                if (err) {
                    res.status(500);
                    res.json({errorMessage: '500 SERVER-SIDE ERROR - This specific rating of yours could not be found.'});
                    return;
                }

                if (rating.length > 0) {
                    //Check if there's actually a rating with this username and tt_number.
                    res.status(200);
                    res.json(rating);
                } else {
                    res.status(404);
                    res.json({errorMessage: '404 NOT FOUND - You have no rating for a movie with the given tt_number, or that movie does not exist.'});
                }
            });
        } else {
            //The user from the token isn't the same as the owner of this rating, so let the user not get it.
            res.status(400);
            res.json({errorMessage: '400 BAD REQUEST - You are not the owner of this rating and can therefore not view.'})
        }
    } else {
        res.status(400);
        res.json({errorMessage: '400 BAD REQUEST - You should provide this command like: localhost:[port]/api/ratings/:username/:tt_number'})
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
                    //Check if there's actually a rating for this username and tt_number, as you can't delete something that doesn't exist.
                    Rating.remove({'username': username, 'tt_number': tt_number}, function (err) {

                        if (err) return handleError(err);

                        res.status(200);
                        res.json({confirmationMessage: '200 OK - Rating has successfully been removed.'});
                    });
                } else {
                    res.status(404);
                    res.json({errorMessage: '404 NOT FOUND - You have no rating for a movie with the given tt_number, or that movie does not exist.'});
                }
            });
        } else {
            //The user from the token isn't the same as the owner of this rating, so let the user not delete it.
            res.status(400);
            res.json({errorMessage: '400 BAD REQUEST - You are not the owner of this rating and can therefore not delete it.'})
        }
    } else {
        res.status(400);
        res.json({errorMessage: '400 BAD REQUEST - You should provide this command like: localhost:[port]/api/ratings/:username/:tt_number'})
    }
});

// MIDDLEWARE FOR CHECKING IF GIVEN RATING POST & PUT BODIES ARE CORRECT
router.use(function (req, res, next) {
    //Needs a JSON file in the body with a giventt_number and a givenRating of 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5 or 5.0
    var given_imdb_tt_number = req.body.imdb_tt_number;
    var giventt_number = parseInt(req.body.tt_number);
    var givenRating = parseFloat(req.body.rating);

    if (given_imdb_tt_number !== undefined && giventt_number !== undefined && givenRating !== undefined && isNaN(giventt_number) === false && isNaN(givenRating) === false) {

        if (givenRating >= 0.0 && givenRating <= 5.0) {
            //Make sure the givenRating is between (non-including) 0.0 and (including) 5.0

            //Make sure that the givenRating only has one decimal, we can forgive the user for giving more decimals...
            givenRating = givenRating.toFixed(1);

            if (givenRating % 1.0 === 0.5 || givenRating % 1.0 === 0.0) {
                //Then make sure that the one decimal number is either 5 (x.5) or 0 (x.0).

                //And now that we know that the ratings are valid, then store them so that the commands found under this
                // one can use them, safely knowing their middleware checked them.
                req.app.locals.given_imdb_tt_number = given_imdb_tt_number;
                req.app.locals.giventt_number = giventt_number;
                req.app.locals.givenRating = givenRating;

                next();
            } else {
                res.status(400);
                res.json({errorMessage: '400 BAD REQUEST - Rating can only be rounded on X.0 or X.5!'})
            }
        } else {
            res.status(400);
            res.json({errorMessage: '400 BAD REQUEST - Rating has to be bigger than 0.0 and smaller than 5.0 (and in increments of 0.5)'})
        }
    } else {
        res.status(400);
        res.json({errorMessage: '400 BAD REQUEST - You are not defining certain required data (correctly). Should be tt_number: & rating: (both as numbers only).'})
    }
});

router.post('/', function (req, res) {
    //Due to the middleware we already know that the given rating is valid (between 0.0 and 5.0 included and in increments of 0.5).
    var decoded = req.app.locals.decoded;
    var tokenUsername = decoded.username;
    var given_imdb_tt_number = req.app.locals.given_imdb_tt_number;
    var giventt_number = req.app.locals.giventt_number;
    var givenRating = req.app.locals.givenRating;

    Rating.find({'imdb_tt_number': given_imdb_tt_number, 'tt_number': giventt_number}, function (err, ratings) {
        //Now go through checks to see if this new givenRating is actually unique.
        if (err) {
            res.status(500);
            res.json({errorMessage: '500 SERVER-SIDE ERROR - This specific givenRating of yours could not be found.'});
            return;
        }

        var unique = true;

        for (var i = 0; i < ratings.length; i++) {
            //Go through all ratings returned for this movie...
            if (ratings[i].username === tokenUsername) {
                //If one is found with the same username as of the user that's requesting this post, it's not unique...
                unique = false;
                break;
            }
        }

        if (unique) {
            //There is no givenRating for this movie yet from the user that is requesting this post command, so create it!
            //Create the new rating.
            var post = new Rating({
                imdb_tt_number: given_imdb_tt_number,
                tt_number: giventt_number,
                username: tokenUsername,
                rating: givenRating
            });

            //And finally save the new rating.
            post.save(function (err, result) {
                if (err) {
                    res.status(500);
                    res.json({errorMessage: '500 SERVER - Rating not added due to a server error.'})
                } else {
                    res.status(201);
                    res.json(post);
                }
            });
        } else {
            res.status(409);
            res.json({errorMessage: '409 CONFLICT - A givenRating on your username for the movie with this given tt_number already exists.'});
        }
    });
});

router.put('/', function (req, res) {
    //Due to the middleware we already know that the given rating is valid (between 0.0 and 5.0 included and in increments of 0.5).
    var decoded = req.app.locals.decoded;
    var tokenUsername = decoded.username;
    var given_imdb_tt_number = req.app.locals.given_imdb_tt_number;
    var giventt_number = req.app.locals.giventt_number;
    var givenRating = req.app.locals.givenRating;

    Rating.find({'imdb_tt_number': given_imdb_tt_number, 'tt_number': giventt_number, 'username': tokenUsername}, function (err, ratings) {
        //Then find a rating with the given tt_number and the username of the authorized user.
        if (err) {
            res.status(500);
            res.json({errorMessage: '500 SERVER-SIDE ERROR - This specific Rating of yours could not be found.'});
            return;
        }

        if (ratings.length > 0) {
            //Check if there's actually a rating for this user and this movie...
            Rating.update({
                'imdb_tt_number': given_imdb_tt_number,
                'tt_number': giventt_number,
                'username': tokenUsername
            }, {'$set': {'rating': givenRating}}, function (err) {
                //And so if not, update the rating!
                if (err) {
                    res.status(500);
                    res.json({errorMessage: '500 SERVER-SIDE ERROR - Issue arose while trying to update the rating.'});
                    return;
                }

                res.status(200);
                res.send({confirmationMessage: '200 OK - Your rating has been updated with the new score.'});
            });
        } else {
            res.status(404);
            res.json({errorMessage: '404 NOT FOUND - Rating with given tt_number and username cannot be found.'})
        }
    });
});

module.exports = router;