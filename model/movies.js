var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
    tt_number: {type: Number, required: true},
    title: {type: String, required: true},
    publication_date: {type: Date, required: true},
    length_min: {type: Number, required: true},
    director: {type: String, required: true},
    description: {type: String, required: true}
});

module.exports = mongoose.model('Movies', movieSchema);