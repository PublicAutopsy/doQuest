
/*
 * GET home page.
 */
var mongoose = require('mongoose');
var Player = mongoose.model('Player');
var title = "doQuest"

exports.create = function(req, res){
	new Player({
		user_name    : req.body.username,
		level        : 1,
		exp          : 1,
		exp_required : 400
	}).save( function(err, player, count){
		res.redirect('/player/'+player.user_name);
	})
}

exports.delete = function( req, res){
	Player.findOne({user_name: req.params.name} , function(err, player){
		player.remove(function(err, player){
			res.redirect('/');
		});
	});
}

exports.index = function(req, res){
	Player.find(function(err, players, count){
		res.render('index', { 
		  	'locals':{
		  		'title' : title,
		  		'players': players
			}  
		});
	});		
}

exports.list = function(req, res){
    Player.find(function(err, players, count){
        res.render('list', {
            'locals':{
                'title' : title,
                'players': players
            }
        });
    });
}


exports.add_exp = function(req, res){
	Player.findOne({user_name: req.params.name}, function (err, player){

		var base_exp = 400;
		var scale = 1;
		var new_exp= Number(req.body.experience_gain);

		function calc_level(){
			player.exp_required = base_exp * (player.level) ^ scale -1;
		}

		function lvl_up(){
			if (player.exp >= player.exp_required){
				player.exp = player.exp - player.exp_required;
				player.level++;
			}
		}

		function add_exp(exp_gained){
			player.exp += exp_gained;
			calc_level( lvl_up() );
		}

		add_exp(new_exp);
		player.save(function(err){
			res.send(player);
		});

	});
}


exports.info = function(req, res){
	Player.findOne({user_name: req.params.name}, function (err, player){
		res.render('players', { 
		  	'locals':{
		  		'title' : title,
		  		'players': player
			}  
		});
	});
}