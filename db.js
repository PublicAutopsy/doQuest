var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Player = new Schema({
	user_name    : String,
    uid          : String,
	level        : Number,
	exp          : Number,
	exp_required : Number,
    preference   : String,
    todo         : Array

});

mongoose.model('Player', Player);

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/doQuest'; 

mongoose.connect(mongoUri);