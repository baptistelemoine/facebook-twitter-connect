
var express = require('express');
var twitter = require('./routes/twitter');
var facebook = require('./routes/facebook');
var path = require('path');

var app = module.exports = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
};

app.configure(function () {
    app.use(allowCrossDomain);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
});

/* TWITTER user timeline & search */
app.get('/twitter/timeline/:user', twitter.timeline);
app.get('/twitter/search/:term', twitter.searchTwitter);

/* FACEBOOK GRAPH API REQUESTS */
//type refer to graph connections : feed, albums...
app.get('/facebook/:type/:user', facebook.feed);

var port = process.env.PORT || 4000;

app.listen(port);