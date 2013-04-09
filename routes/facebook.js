
var oauth = require('oauth').OAuth2;
var url = require('url');
var async = require('async');
var https = require('https');
var querystring = require('querystring');
var url = require('url');

var FB_APP_ID = "your_app_id";
var FB_APP_SECRET = "your_appp_secret";
var GRAPH_API = "graph.facebook.com";
 
var oa = new oauth(
    FB_APP_ID,
    FB_APP_SECRET,
    GRAPH_API
  );

var options = {
  host:GRAPH_API,
  path:'/oauth/access_token?'+querystring.stringify({
    client_id:FB_APP_ID, 
    client_secret:FB_APP_SECRET, 
    grant_type:'client_credentials'
  })
};

exports.feed = function (req, res){
  //waiting for access_token before requesting graph api
  async.waterfall([
      function (callback){
        //login as an app
        https.get(options, function (res){
          res.setEncoding('utf8');
          res.on('data', function (data){
            //pass the token to the next function
            callback(null, querystring.parse(data));
          });
        }).on('error', function (error){ console.log(error); });
      },
      function (data, callback){
        //get url parameters : user, type, limit, offset
        var user = req.params.user;
        var type = req.params.type;        
        var params = url.parse(req.url, true).query;

        //construct url
        var uri = url.format({
          protocol:'https',
          host:GRAPH_API,
          pathname:[user,type].join('/'),
          query:{'limit':params.limit, 'offset':params.offset}
        });
        //finally request the api
        oa.get(uri, data.access_token, function (error, data, response) {
              if (error) {
                res.send(error, 500);
              } else {
                callback(null, data)
              }
        });
      }
  ], function (error, result){
      res.json(JSON.parse(result));
  });

};
 
