mongoose.connect('mongodb://localhost/Notflix', {useMongoClient:true});
var Movie = require('../model/movies.js');
var User = require('../model/user.js');
var Rating = require('../model/ratings.js');

//TODO: List of what this setup file has to create to work with the tests (So only pre create what's listed here!):
// - A movie with tt_number:123, title:"The Lego Movie", publication_date:"2015-04-26", length_min:94, director:"Leg Godt", description:"Tapping into that nostalgia mine!"
// - A movie with tt_number:456, title:"Die Hard 291", publication_date:"2101-08-02", length_min:97, director:"Michael Bay", description:"Nobody wants to see this anymore, oh god let it stop."
// - A movie with tt_number:789, title:"The MegaBlox Movie", publication_date:"2016-11-19", length_min:91, director:"BootLeg Godt", description:"A bootleg movie about a bootleg construction block."

// - A user with last_name:'Slavov', middle_name:'Slavinov', first_name:'Martin', username:'sswxyz17', passwords:'peanuts'
// - A user with last_name:'Kerbusch', middle_name:'', first_name:'Yoran', username:'toastyblast', passwords:'cheese'
// - A user with last_name:'Deurie', middle_name:'Bonkie', first_name:'Martyni', username:'skellyton', passwords:'b0nk3rs'

// - A rating with tt_number:123, username:'toastyblast', rating: 4.5
// - A rating with tt_number:123, username:'sswxyz17', rating: 4.0
// - A rating with tt_number:123, username:'skellyton', rating: 3.0
//DO NOT ADD RATINGS FOR tt_number:456!!!
// - A rating with tt_number:789, username:'skellyton', rating: 2.0
// - A rating with tt_number:789, username:'toastyblast', rating: 0.0

/* CREATE THE MOVIES */
// var post = new Movie({
//     tt_number: ???,
//     title: '???',
//     publication_date: "YYYY-MM-DD",
//     length_min: ???,
//     director: '??? ???',
//     description: '???'});
//
// post.save(function (err, result) {
//     if (err) {
//         return console.error(err);
//     }
// });

/* CREATE THE USERS */
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

/* CREATE THE RATINGS */
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