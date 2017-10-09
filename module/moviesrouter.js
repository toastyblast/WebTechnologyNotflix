var express = require('express');
var router = express.Router();

app.get('/', function (req, res) {
    res.json({response:'Returns a list of all movies!'});
});

app.get('/:tt_number', function (req, res) {
    res.json({response:'Returns the movie with that tt_number!'});
});

app.get('/:title', function (req, res) {
    res.json({response:'Returns a movie with that title!'});
});

app.get('/:director', function (req, res) {
    res.json({response:'Returns all movies with the given director!'});
});

module.exports = router;