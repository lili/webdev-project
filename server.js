var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');
var multer        = require('multer');
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var mongoose      = require('mongoose');

var connectionString = 'mongodb://localhost/project';

if(process.env.MONGOLAB_PURPLE_URI) {
    connectionString = process.env.MONGOLAB_PURPLE_URI;
}

mongoose.connect(connectionString);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
multer();
app.use(session({
    secret: 'this is the secret',
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

require("./app/app.js")(app);

var port = process.env.PORT || 3000;

app.listen(port);