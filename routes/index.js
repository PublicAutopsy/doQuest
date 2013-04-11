
/*
 * GET home page.
 */
var mongoose = require('mongoose');
var Player = mongoose.model('Player');
var title = "doQuest";

//exports.create = function(req, res){
//	new Player({
//		user_name    : req.body.username,
//		level        : 1,
//		exp          : 1,
//		exp_required : 400
//	}).save( function(err, player, count){
//		res.redirect('/player/'+player.user_name);
//	})
//}

exports.delete = function( req, res){
	Player.findOne({user_name: req.params.name} , function(err, player){
		player.remove(function(err, player){
			res.redirect('/');
		});
	});
}

exports.index = function(req, res){
    if (req.isAuthenticated()){
	Player.findOne({user_name: req.user.user_name} ,function(err, player){

            res.render('index', {
                'locals':{
                'user_name' : player.user_name,
                    'title' : title,
                    'players': player,
                    'preference' : player.preference
                }
            });
    }); }
    else {
            res.render('index');
        }
}

exports.list = function(req, res){
    Player.find(function(err, players, count){
        if (req.isAuthenticated()){

            res.render('list', {
                'locals':{
                    'user_name' : req.user.user_name,
                    'title' : title,
                    'players': players
                }
            });
        } else{
            res.render('list', {
                'locals':{
                    'title' : title,
                    'players': players
                }
            });
        }
    });
}
exports.prefs = function(req, res){
    if (req.isAuthenticated()){
        Player.findOne({user_name: req.params.name}, function(err, player){
            console.log(player);
            res.render('prefs', {
                'locals':{
                    'user_name' : req.user.user_name,
                    'title' : title,
                    'players': player,
                    'preference' : player.preference
                }
            });
        });
        } else{
           res.redirect("/");
        }
}


exports.add_exp = function(req, res){
    if (req.isAuthenticated()){
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
  }  else {
        res.send();
    }
}


exports.info = function(req, res){
	Player.findOne({user_name: req.params.name}, function (err, player){
        if (req.isAuthenticated()){
            res.render('players', {
                'locals':{
                    'user_name' : req.user.user_name,
                    'title' : title,
                    'players': player
                }
            });
        } else{
            res.render('players', {
                'locals':{
                    'title' : title,
                    'players': player
                }
            });
        }
	});
}

exports.add_todo = function(req, res){
    Player.findOneAndUpdate({user_name: req.params.name},
        {$pushAll: {todos: [{text:req.body.new_todo, done:false }]}},
        {upsert: true},
        function(err, player){
            if(err){
                console.log(err);

            }else{
                res.send(player);
                res.end();
                console.log(player);
            }
        })
}

exports.del_todo = function(req, res){
    Player.findOneAndRemove({user_name: req.params.name},
        {pull: {todos: {_id:req.body.todo} }},
        function(err, player){
            if(err){
                console.log(err);

            }else{
                res.send(player);
            }
        })
}