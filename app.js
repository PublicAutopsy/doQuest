
/**
 * Module dependencies.
 */

var express = require('express')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mu2express = require("mu2express")
  , mongoose = require('mongoose');

var app = express();

require('./db');
var Player = mongoose.model('Player');


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.engine('mustache', mu2express.engine);
  app.set('view engine', 'mustache');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var routes = require('./routes');

app.get('/', routes.index);
app.get('/player/:name', routes.info);
app.get('/list', routes.list);
app.post('/create', routes.create);
app.get('/delete/:name', routes.delete);
app.post('/player/:name/add_exp', routes.add_exp);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
