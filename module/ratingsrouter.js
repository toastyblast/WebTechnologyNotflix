var express = require('express');
var router = express.Router();

router.post('/api/users', function (req, res) {
    res.send('Creates a user with the sent data, if it is original!');
});

router.get('/api/users', function (req, res) {
    res.send('Returns a list of all users, if the client requesting it is logged in!');

    //TODO: Check for if there's a username query here.
});

//TODO: you need to search for queries in the routing above this TODO.
// router.get('/api/users/:username', function (req, res) {
//     res.send('Returns the user with that specific username (without their password, of course)');
// });

router.get('/api/users/:id', function (req, res) {
    res.send('Returns the user with that specific database ID (without their password, of course)');
});

module.exports = router;