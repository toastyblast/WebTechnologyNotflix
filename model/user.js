var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema =  new Schema ({
    _id:{type : String},
    last_name: {type : String, required: true},
    middle_name : {type : String, required: false},
    first_name : {type: String, required:true},
    username: {type: String, required:true},
    passwords: {type: String, required:true},
    favourites: {type: Array, required:false}
});

module.exports = mongoose.model('User', UserSchema);