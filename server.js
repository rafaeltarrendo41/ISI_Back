require('dotenv').config();

const express = require('express');
var app = express();

const bodyParser = require('body-parser');
const validator = require('express-validator');
const sanitizer = require('express-sanitizer');

global.urlBase = 'https://wtransnet.herokuapp.com/';



app.use(bodyParser.json({
    limit: '50mb',
    verify: function(request, response, buffer){
        if(request.originalUrl.startsWith('/webhook')){
            request.rawBody = buffer.toString();
        }
    }
}), bodyParser.urlencoded({
    extended: true
}));

app.use('/', require('./routes/main.routes'));

const server = app.listen(process.env.PORT, function(err){
    if(!err){
        console.log(`Your app is listening on ${global.urlBase}`);
    } else {
        console.log(err);
    }
});

server.timeout = 100000;

module.exports = app;