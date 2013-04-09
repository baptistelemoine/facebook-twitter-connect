
var oauth = require('oauth').OAuth;
var url = require('url');
var async = require('async');
var https = require('https');

var TWITTER_CONSUMER_KEY = "your_consumer_key";
var TWITTER_CONSUMER_SECRET = "your_consumer_secret";

var TWITTER_API = 'api.twitter.com';
 
var oa = new oauth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    "1.0A",
    "your_callback_url",
    "HMAC-SHA1"
  );
//generate a token in your app admin panel
var token = "your_token";
var tokenSecret = "your_token_secret";

exports.timeline = function (req, res){  
  var user = req.params.user;
  var params = url.parse(req.url, true).query;

  //construct url
  var uri = url.format({
    protocol:'https',
    host:TWITTER_API,
    pathname:['1.1','statuses','user_timeline.json'].join('/'),
    query:{'screen_name':user, 'count':params.count, 'enclude_entities':1}
  });

  oa.get(uri, token, tokenSecret, function (error, data, response) {
        if (error) {
          res.send("Error getting twitter timeline for screen name : fnsea ", 500);
        } else {
          // console.log(data);
          res.json(JSON.parse(data));
        }
    });
};

exports.searchTwitter = function (req, res){
  var term = req.params.term;
  oa.get('https://api.twitter.com/1.1/search/tweets.json?q='+encodeURIComponent(term), token, tokenSecret, function (error, data, response) {
        if (error) {
          res.send("Error getting twitter timeline for screen name : ", 500);
        } else {
          //console.log(data);
          res.json(JSON.parse(data));
        }
    });
};
 
