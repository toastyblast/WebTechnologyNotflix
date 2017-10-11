var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var RatingsSchema = new Schema({
    tt_number: {type: Number, required: true},
    username: {type: String, required: true},
    rating: {type: Number, required: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Rating', RatingsSchema);