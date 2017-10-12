var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient:true});
var User = require('../model/user.js');
var jwt = require('jsonwebtoken');
var router = express.Router();


//Created ratings (On Yoran's Database):
// - last_name: 'kerbusch', middle_name: '', first_name : 'yoran', username: 'yoran', passwords: 'peanuts'
// - ...

// var post = new User({
//     last_name: '???',
//     middle_name: '',
//     first_name : '???',
//     username: '???',
//     passwords: '???'
// });
//
// post.save(function (err, result) {
//     if (err) {
//         return console.error(err);
//     }
// });


router.post('/', function (req, res) {

    var post = new User({
        last_name: req.body.lastname ,
        middle_name: req.body.middlename,
        first_name : req.body.firstname,
        username: req.body.usern,
        passwords: req.body.password
    });

    post.save(function (err, result) {
        if (err) {
            // return console.error(err);
            res.status(409);
            res.json("409 : User not added.")
        } else {
            res.json(post);
        }
    });
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
    User.find({}, {'last_name' : 1, 'first_name' : 1, 'username' : 1, '_id' : 0},function (err, users) {
        if (err) return console.error(err);

        res.json(users);
    });
});

router.get('/:usern', function (req, res) {
    User.find({'username' : req.params.usern}, function (err, users) {
        if (err) return console.error(err);
        res.json(users);
    })
});

module.exports = router;