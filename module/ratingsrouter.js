var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var app = express();

router.get('/', function (req, res) {
    //TODO:
    res.send('Send the average rating for every movie');
    res.status(200);
});

router.get('/:value', function (req, res) {
    //TODO: Check if only a tt_number has been entered. Everyone is allowed to use the command in that case, returning an
    // TODO: average rating for the given movie.

    //The user has either a username filled in or both a username and a tt_number, in which case they want either all
    // their reviews, or a review on a specific tt_number movie.
    var token = req.headers['authorization'];

    jwt.verify(token, app.get('secret-key'), function (err, decoded) {
        if (err) {
            res.status(403);
            res.json({errorMessage:'FORBIDDEN - You do not have a token, meaning you are not logged in and therefore ' +
            'not allowed to use this command.'});
        } else {
            //TODO: Check for if there's a username query as well as a tt_number here and the username of the user matches
            // TODO: the logged in user's token decoded. If so, return the user's rating on the movie with this tt_number, if they have one.
            //TODO: If only a username is filled in and it matches, return all ratings made by the user.
            res.send('Gets a specific rating for this user, overriding the return of an average over all users.');
            res.status(200)
        }
    });
});

//TODO: Use middleware to do the authentication at this point. Yoran, ask teacher how to do this.

router.get('/:id', function (req, res) {
    var token = req.headers['authorization'];

    jwt.verify(token, app.get('secret-key'), function (err, decoded) {
        if (err) {
            res.status(403);
            res.json({errorMessage:'FORBIDDEN - You do not have a token, meaning you are not logged in and therefore ' +
            'not allowed to use this command.'});
        } else {
            //TODO:
            res.send('Returns the rating with that specific database ID (if the user is logged in and it is theirs, fo course');
            res.status(200);
        }
    });
});

router.post('/', function (req, res) {
    var token = req.headers['authorization'];

    jwt.verify(token, app.get('secret-key'), function (err, decoded) {
        if (err) {
            res.status(403);
            res.json({errorMessage:'FORBIDDEN - You do not have a token, meaning you are not logged in and therefore ' +
            'not allowed to use this command.'});
        } else {
            //TODO: (also check if the request's body is actually filled with correct data (400) or if it already exists (409))
            res.send('Creates a rating with the sent data with the username in the token, if the user does not already have a rating on this movie!');
            res.status(201);
        }
    });
});

router.put('/:value', function (req, res) {
    //Needs a /:username & /:tt_number.

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

router.delete('/:value', function (req, res) {
    //Needs a /:username & /:tt_number.

    //TODO: check if there's both a username and a tt_number specified.

    var token = req.headers['authorization'];

    jwt.verify(token, app.get('secret-key'), function (err, decoded) {
        if (err) {
            res.status(403);
            res.json({errorMessage:'FORBIDDEN - You do not have a token, meaning you are not logged in and therefore ' +
            'not allowed to use this command.'});
        } else {
            //TODO: (also check if the requested rating to remove actually exists (404) or if it's actually owned by this user (403))
            res.send('Removes a rating made by this user of the movie with the specified tt_number');
            res.status(200);
        }
    });
});

module.exports = router;