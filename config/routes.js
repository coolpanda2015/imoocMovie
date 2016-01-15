var Movie=require('../app/controllers/movie');
var User=require('../app/controllers/user');
var Index=require('../app/controllers/index')

module.exports=function(app){
	//pre handle user
	app.use(function(req,res,next){
		var _user=req.session.user;
		app.locals.user=_user
		next();
	})
	// 首页 
	app.get('/',Index.index)
	// 电影	
	app.get('/movie/:id',Movie.detail)
	app.get('/admin/list',Movie.list)
	app.get('/admin/update/:id',Movie.update)
	app.get('/admin/admin',Movie.new)
	app.post('/admin/movie/new',Movie.save)
	app.delete("/admin/list",Movie.del)
	// 用户
	app.post('/user/signup',User.signup)
	app.get('/admin/userlist',User.userlist)
	app.post('/user/signin',User.signin)
	app.get('/logout',User.logout)
}