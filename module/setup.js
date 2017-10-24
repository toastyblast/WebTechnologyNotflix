var mongoose = require('mongoose');
var express = require('express');
mongoose.connect('mongodb://localhost/Notflix', {useMongoClient: true});
var Movie = require('../model/movies.js');
var User = require('../model/user.js');
var Rating = require('../model/ratings.js');
var SetupMark = require('../model/setupMark.js');
var router = express.Router();


/* A summarized list of what dummy data this setup file creates: */
// - A movie with tt_number:123, title:"The Lego Movie", publication_date:"2015-04-26", length_min:94, director:"Leg Godt", description:"Tapping into that nostalgia mine!"
// - A movie with tt_number:456, title:"Die Hard 291", publication_date:"2101-08-02", length_min:97, director:"Michael Bay", description:"Nobody wants to see this anymore, oh god let it stop."
// - A movie with tt_number:789, title:"The MegaBlox Movie", publication_date:"2016-11-19", length_min:91, director:"BootLeg Godt", description:"A bootleg movie about a bootleg construction block."

// - A user with last_name:'Slavov', middle_name:'Slavinov', first_name:'Martin', username:'sswxyz17', passwords:'peanuts'
// - A user with last_name:'Kerbusch', middle_name:'', first_name:'Yoran', username:'toastyblast', passwords:'cheese'
// - A user with last_name:'Deurie', middle_name:'Bonkie', first_name:'Martyni', username:'skellyton', passwords:'b0nk3rs'
// - A user with last_name:'Plier', middle_name:'Moo', first_name:'Markie', username:'markiplier', passwords:'apples'
//DO NOT ADD RATINGS FOR USER 'markiplier'!!! (Will break tests)

// - A rating with tt_number:123, username:'toastyblast', rating: 4.5
// - A rating with tt_number:123, username:'sswxyz17', rating: 4.0
// - A rating with tt_number:123, username:'skellyton', rating: 3.0
//DO NOT ADD RATINGS FOR tt_number:456!!! (Will break tests)
// - A rating with tt_number:789, username:'skellyton', rating: 2.0
// - A rating with tt_number:789, username:'toastyblast', rating: 0.0


// function getIMG(tt_number, director) {
//     var movie;
//     var xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function() {
//         if (this.readyState === 4 && this.status === 200) {
//             movie = JSON.parse(this.responseText);
//
//             var post1 = new Movie({
//                 tt_number: ''+tt_number+'',
//                 title: ''+movie[0].title+'',
//                 publication_date: ''+movie[0].release_date+'',
//                 length_min: ''+movie[0].runtime+'',
//                 director: ''+director+'',
//                 description: ''+movie[0].overview+''
//             });
//             post1.save(function (err, result) {
//                     if (err) {
//                         return console.error(err);
//                     }
//                 });
//         }
//     };
//     xhr.open("GET", "https://api.themoviedb.org/3/movie/"+tt_number+"?api_key=af1b95e9f890b9b6840cf6f08d0e6710&language=en-US", true);
//     xhr.send();
// }
/* CREATE THE MOVIES */
router.post('/', function (req, res) {

    checkIfDataIsImported(function () {
        importData();
    });

    function checkIfDataIsImported(callback) {
        SetupMark.find({title: 'dummypost'}, function (err, movies) {
            if (err) {
                res.status(500);
                res.json({errorMessage: 'No list of movies could be found in the database.'});
                return console.error(err);
            } else if (movies.length === 1) {
                console.log(movies.length);
                res.json('Data was already imported.');
            } else if (movies.length === 0) {
                callback();
            }
        });
    }

    function importData() {
        var dummypost = new SetupMark({
            tt_number: 999999999,
            title: 'dummypost'
        });

        dummypost.save(function (err, result) {
            if (err) {
                return console.error(err);
            }
        });

        var post1 = new Movie({
            imdb_tt_number : 'tt1490017',
            tt_number: 123,
            title: 'The Lego Movie',
            publication_date: "2014-04-07",
            length_min: 94,
            director: 'Christopher Miller',
            description: 'An ordinary Lego construction worker, thought to be the prophesied \'Special\', is recruited ' +
            'to join a quest to stop an evil tyrant from gluing the Lego universe into eternal stasis. '
        });

        post1.save(function (err, result) {
            if (err) {
                return console.error(err);
            }
        });


        var post2 = new Movie({
            imdb_tt_number : 'tt0095016',
            tt_number: 456,
            title: "Die Hard",
            publication_date: "1988-08-20",
            length_min: 97,
            director: "John McTiernan",
            description: "John McClane, officer of the NYPD, tries to save his wife Holly Gennaro and several others" +
            " that were taken hostage by German terrorist Hans Gruber during a Christmas party at the Nakatomi Plaza " +
            "in Los Angeles. "
        });

        post2.save(function (err, result) {
            if (err) {
                return console.error(err);
            }
        });

        var postThree = new Movie({
            imdb_tt_number : 'tt1663662',
            tt_number: 789,
            title: "Pacific Rim",
            publication_date: "2013-11-12",
            length_min: 91,
            director: "Guillermo del Toro  ",
            description: "As a war between humankind and monstrous sea creatures wages on, a former pilot and a trainee" +
            " are paired up to drive a seemingly obsolete special weapon in a desperate effort to save the world from " +
            "the apocalypse. "
        });

        postThree.save(function (err, result) {
            if (err) {
                return console.error(err);
            }
        });

        // getIMG('tt1490017', 'Christopher Miller');
        // getIMG('tt0095016', 'John McTiernan');
        // getIMG('tt1663662', 'Guillermo del Toro');

        /* CREATE THE USERS */
        var post4 = new User({
            last_name: 'Slavov',
            middle_name: 'Slavinov',
            first_name: 'Martin',
            username: 'sswxyz17',
            passwords: 'peanuts'
        });

        post4.save(function (err, result) {
            if (err) {
                return console.error(err);
            }
        });

        var post5 = new User({
            last_name: 'Kerbusch',
            middle_name: '',
            first_name: 'Yoran',
            username: 'toastyblast',
            passwords: 'cheese'
        });

        post5.save(function (err, result) {
            if (err) {
                return console.error(err);
            }
        });

        var post6 = new User({
            last_name: 'Deurie',
            middle_name: 'Bonkie',
            first_name: 'Martyni',
            username: 'skellyton',
            passwords: 'b0nk3rs'
        });

        post6.save(function (err, result) {
            if (err) {
                return console.error(err);
            }
        });

        var postSeven = new User({
            last_name: 'Plier',
            middle_name: 'Moo',
            first_name: 'Markie',
            username: 'markiplier',
            passwords: 'apples'
        });

        postSeven.save(function (err, result) {
            if (err) {
                return console.error(err);
            }
        });

        /* CREATE THE RATINGS */
        var post7 = new Rating({
            tt_number: 123,
            username: 'toastyblast',
            rating: 4.5
        });

        post7.save(function (err, result) {
            if (err) {
                return console.error(err);
            }
        });

        var post8 = new Rating({
            tt_number: 123,
            username: 'sswxyz17',
            rating: 4.0
        });

        post8.save(function (err, result) {
            if (err) {
                return console.error(err);
            }
        });

        var post9 = new Rating({
            tt_number: 123,
            username: 'skellyton',
            rating: 3.0
        });

        post9.save(function (err, result) {
            if (err) {
                return console.error(err);
            }
        });

        var post10 = new Rating({
            tt_number: 789,
            username: 'skellyton',
            rating: 2.0
        });

        post10.save(function (err, result) {
            if (err) {
                return console.error(err);
            }
        });

        var post11 = new Rating({
            tt_number: 789,
            username: 'toastyblast',
            rating: 0.0
        });

        post11.save(function (err, result) {
            if (err) {
                return console.error(err);
            }
        });

        res.json('Data has been imported');
    }


});

module.exports = router;
