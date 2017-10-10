var express = require('express');
var jwt = require('jsonwebtoken');

var app = express();

app.set('secret-key', 'CounsellorPalpatineDidNothingWrong');

var token = jwt.sign(user, app.get('secret-key'), {
    // expiresInMinutes: 1440 //Might crash the server, so left commented out for now.
});