var User=require('../models/user');
//signup
exports.signup=function(req,res){
	//  /user/signup/:1?userid=2
	//  {userid:3}
	// var _userid=req.params.userid;
	// var _userid=req.query.userid;
	// var _userid=req.body.userid;

	//当获取req.param('userid')时，会有优先级：先路由再请求体(比如Ajax传的数据)最后参数(query)
	var _user=req.body.user;

	User.find({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}
		if(user){
			res.redirect('/')
		}
		var user=new User(_user)
		user.save(function(err,user){
			if(err){console.log(err)};
			res.redirect('/admin/userlist')
		})
	})
}

//userlist
exports.userlist=function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('userlist', {
			'title':'用户列表页',
			'users':users
		});
	})
}

//signin
//session的持久化：1.基于cookie 2.基于内存 3.基于redis 4.基于mongodb
exports.signin=function(req,res){
	var _user=req.body.user
	var name=_user.name
	var password=_user.password

	User.findOne({name:name},function(err,user){
		if (err){
			console.log(err)
		}
		if (!user){
			return res.redirect('/')
		}

		user.comparePassword(password,function(err,isMatch){
			if (err){
				console.log(err)
			}
			if (isMatch){
				req.session.user = user; 
				return res.redirect('/')
			}
			else{
				console.log('Pass wrong')
			}
		})
	})
}

//logout
exports.logout=function(req,res){
	delete req.session.user
	//delete app.locals.user
	res.redirect('/')
}