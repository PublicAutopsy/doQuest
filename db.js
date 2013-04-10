var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Player = new Schema({
	user_name    : String,
    uid          : String,
	level        : Number,
	exp          : Number,
	exp_required : Number,
    preferences  : String,
    timeStamp    : { type: Date, default: Date.now },
    todos        : [
        {
            text : String,
            done : Boolean

        }
    ]

});

mongoose.model('Player', Player);

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/doQuest'; 

mongoose.connect(mongoUri);