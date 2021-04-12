const express = require('express');
const port = process.env.PORT || 3306;
const host = process.env.HOST || '193.136.11.180';

var app = express();

const server = app.listen(process.env.PORT, function(err){
    if(!err){
        console.log('Your app is listening on ' + host + ' and port ' + port);
    } else {
        console.log(err);
    }
});