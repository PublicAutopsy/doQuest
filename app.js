
/**
 * Module dependencies.
 */

var express = require('express')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , util = require('util')
  , mu2express = require("mu2express")
  , mongoose = require('mongoose');

var app = express();

var _twitterConsumerKey = "PrrKxKcCpcwWsgw7G6oVsw";
var _twitterConsumerSecret = "nNXeDo8xMmC2PmUzEkqfdhbpo4DMLIApN8iRZRGZg";

require('./db');
var Player = mongoose.model('Player');


passport.use(new TwitterStrategy({
    consumerKey: _twitterConsumerKey,
    consumerSecret: _twitterConsumerSecret,
    callbackURL: "http://secret-sierra-7460.herokuapp.com/success"
},
function(token, tokenSecret, profile, done){
    console.log(profile.username);
    Player.findOne({uid: profile.id}, function(err, user){
        if(user){
            done(null, user);
        } else {
            new Player({
                user_name    : profile.username,
                uid          : profile.id,
                level        : 1,
                exp          : 1,
                exp_required : 400,
                preference   : "Bonjour!",
                todos        : [{
                    text: "Create ToDos",
                    done: false
                }]
            }).save( function(err, player, count){
                    console.log(player);
                    if (err){throw(err)}
                    done(null, user);
                });
        }

    });
}));

passport.serializeUser(function(player, done) {
    done(null, player.uid);
});

passport.deserializeUser(function(uid, done) {
    Player.findOne({uid: uid}, function (err, player) {
        done(err, player);
    });
});


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.engine('mustache', mu2express.engine);
  app.set('view engine', 'mustache');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: "ThisIsMySecret"}));
  app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


app.configure('development', function(){
  app.use(express.errorHandler());
});


var routes = require('./routes');

app.get('/login',
    passport.authenticate('twitter'), function(req, res){

    });

app.get('/success',
    passport.authenticate('twitter', { failureRedirect: '/login'}),
    function(req, res){
        res.redirect('/');
    });

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


app.get('/', routes.index);
app.get('/player/:name', routes.info);
app.get('/preferences/:name', routes.prefs);
app.get('/list', routes.list);
//app.post('/create', routes.create);
app.get('/delete/:name', routes.delete);
app.post('/player/:name/add_exp', routes.add_exp);
app.post('/player/:name/add_todo', routes.add_todo);

function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()) {return next(); }
    res.redirect('/');
}

http.createServer(app, function(req, res){
  if (req.url === '/favicon.ico') {
      res.writeHead(200, {'Content-Type': 'image/x-icon'} );
      res.end();
      return;
    }
}).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
