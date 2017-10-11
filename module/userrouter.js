var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient:true});
var User = require('../model/user');

router.post('/:last&:middle&:first&:user&:pass', function (req, res) {
    var post = new User({
        last_name: req.params.last ,
        middle_name: req.params.middle,
        first_name : req.params.first,
        username: req.params.user,
        passwords: req.params.pass
    });

    post.save(function (err, result) {
        if (err) {
            return console.error(err);
        }
    });
});

router.get('/', function (req, res) {
    User.find(function (err, users) {
        if (err) return console.error(err);
        res.json(users);
    });
});

router.get('/:usern', function (req, res) {
    User.find({username : req.params.usern}, function (err, users) {
        if (err) return console.error(err);
        res.json(users);
    })
});

module.exports = router;