mongoose.connect('mongodb://localhost/Notflix', {useMongoClient:true});
var Movie = require('../model/movies.js');
var User = require('../model/user.js');
var Rating = require('../model/ratings.js');

//TODO: Add dummy data to the database's tables, if there's none in it (aka startup)

// MOVIES
// var post = new Movie({
//     tt_number: ???,
//     title: '???',
//     publication_date: DD-MM-YYYY,
//     length_min: ???,
//     director: '??? ???',
//     description: '???'});
//
// post.save(function (err, result) {
//     if (err) {
//         return console.error(err);
//     }
// });

// USERS
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

// RATINGS
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