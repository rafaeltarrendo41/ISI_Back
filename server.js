require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const bodyParser = require('body-parser');
const validator = require('express-validator');
const sanitizer = require('express-sanitizer');
const session = require('express-session');
const passport = require('./config/passport');

//global.urlBase = `127.0.0.1`;
global.urlFront = `https://wtransnet-face.herokuapp.com`;
global.jasminUrl = `https://my.jasminsoftware.com/api/252605/252605-0001/`;
global.urlBase = `httpc://wtransnet.herokuapp.com`;


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

//app.use(passport.initialize());
//app.use(passport.session());

app.set("trust proxy", 1);

//CORS
app.use('/', function(request, response, next){
    response.header('Access-Control-Allow-Origin', urlFront);
    response.header('Access-Control-Allow-Creditials', true);
    response.header('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS, GET');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
})


//require('./routes/auth.routes')(app, passport);
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