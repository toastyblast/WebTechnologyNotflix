var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var setupCheckSchema = new Schema({
    tt_number:{type:Number, required:true},
    title:{type:String, required:true}
});

module.exports = mongoose.model('Setup', setupCheckSchema);