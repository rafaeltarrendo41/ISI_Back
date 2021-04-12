require('dotenv').config();

const express = require('express');
const port = process.env.PORT || 3306;
const host = process.env.HOST || '193.136.11.180';

global.urlBase = 'https://wtransnet.herokuapp.com/';

var app = express();

const server = app.listen(process.env.PORT, function(err){
    if(!err){
        console.log(`Your app is listening on ${global.urlBase}`);
    } else {
        console.log(err);
    }
});

server.timeout = 100000;

module.exports = app;