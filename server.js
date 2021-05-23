require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const upload = require('express-fileupload');
app.use(cors());
app.use(upload());

const bodyParser = require('body-parser');
const validator = require('express-validator');
const sanitizer = require('express-sanitizer');
const session = require('express-session');
const passport = require('./config/passport');

// global.urlBase = `127.0.0.1`;
global.urlFront = `https://wtransnet-face.herokuapp.com`;
global.jasminUrl = `https://my.jasminsoftware.com/api/252605/252605-0001/`;
global.urlBase = `httpc://wtransnet.herokuapp.com`;

app.post('/ficheiro', function (req, res) {
    //console.log(req)
    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).json({msg: 'No files were uploaded'});
    }

    var myFile = req.files.file;
//console.log(myFile);
    myFile.mv('./'+ myFile.name, function(err){
        if(err) return res.status(500).json({msg:err});
        res.json({msg: myFile.name})
    });
      
});
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
// app.use('/', function(request, response, next){
//     response.header('Access-Control-Allow-Origin', urlFront);
//     response.header('Access-Control-Allow-Creditials', true);
//     response.header('Access-Control-Allow-Methods', 'PUT, POST, OPTIONS, GET');
//     response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// })


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