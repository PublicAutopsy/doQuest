var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Player = new Schema({
	user_name    : String,
	level        : Number,
	exp          : Number,
	exp_required : Number

});

mongoose.model('Player', Player);

mongoose.connect('mongodb://localhost/noderpg');