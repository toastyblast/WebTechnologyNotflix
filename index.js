//Load the express module and create a new app with it.
var express = require('express');
var app = express();

//Parse the body of HTTP request and transform it to JSON.
var bodyParser = require('body-parser');
app.use(bodyParser.json());

//Now specify all the URL routings and add their handling
app.get('/', function (req, res) {
   res.send('Hello world from JavaScript!');
});

//...

//Start the server at port 3000.
app.listen(3000);