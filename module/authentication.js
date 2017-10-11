var express = require('express');
var jwt = require('jsonwebtoken');

var app = express();

app.set('secret-key', 'CounsellorPalpatineDidNothingWrong');

//TODO: Ask teacher on how to get data from token exactly and how to set certain data in its payload.
var token = jwt.sign(user, app.get('secret-key'), {
    // expiresInMinutes: 1440 //Might crash the server, so left commented out for now.
});