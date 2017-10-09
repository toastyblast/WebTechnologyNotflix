var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema =  new Schema ({
    last_name: {type : String, required: true},
    middle_name : {type : String, required: false},
    first_name : {type: String, required:true},
    username: {type: String, required:true},
    passwords: {type: Number, required:true}
});

module.exports = mongoose.model('User', UserSchema);