var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.json({response:'Returns a list of all movies!'});

    //TODO: Check for any queries in the link here, otherwise return all movies.
});

//TODO: Turn these into a search query you check for in the router.get above this TODO.
// router.get('/:tt_number', function (req, res) {
//     res.json({response:'Returns the movie with that tt_number!'});
// });
//
// router.get('/:title', function (req, res) {
//     res.json({response:'Returns a movie with that title!'});
// });
//
// router.get('/:director', function (req, res) {
//     res.json({response:'Returns all movies with the given director!'});
// });

router.get('/:id', function (req, res) {
    res.json({response:'Returns the movie with that database ID!'});
});

module.exports = router;