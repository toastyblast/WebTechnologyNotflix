var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
    imdb_tt_number : {type:String, required: true},
    tt_number: {type: Number, required: true},
    title: {type: String, required: true},
    publication_date: {type: Date, required: true},
    length_min: {type: Number, required: true},
    director: {type: String, required: true},
    description: {type: String, required: true}
});

movieSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Movies', movieSchema);