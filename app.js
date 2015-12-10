var express = require('express');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var mongoose=require('mongoose');
var Movie=require('./models/movie')
var _=require('underscore')
var port = process.env.PORT||3000;
var app = express();

mongoose.connect('mongodb://localhost/imooc')

app.set('views','./views/pages');
app.set('view engine','jade');
app.locals.moment=require("moment")
//app.use(bodyParser.urlencoded({extended:true}))
// app.use(require('body-parser').urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended:true}))
//app.use(express.static(path.jion(__dirname,"bower_components")))
app.use(serveStatic('public'))

app.listen(port)
console.log('this is'+port)
// index page
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index', {
			'title':'首页',
			'movies':movies
		});
	})
})
// detail page
app.get('/movie/:id',function(req,res){
	var id=req.params.id

	Movie.findById(id,function(err,movie){
		if(err){
			console.log(err)	
		}
		res.render('detail',{
			title:'imooc'+movie.title,
			movie:movie
		})	
	})
	
})
// list page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list', {
			'title':'列表页',
			'movies':movies
		});
	})
})

//admin update 
app.get('/admin/update/:id',function(req,res){
	var id=req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'immooc 后台更新',
				movie:movie

			})
		})
	}
})
// admin page
app.get('/admin/admin',function(req,res){
	res.render('admin',{
		'title':'后台录入页',
		movie:{
			title:'',
			doctor:'',
			country:'',
			year:'',
			poster:'',
			flash:'',
			sumarry:'',
			language:''
		}
	})
})

//admin post
app.post('/admin/movie/new',function(req,res){
	var id = req.body.movie._id
	console.log(id)
	var movieObj=req.body.movie
	console.log(movieObj)
	var _movie
	//非新加的电影没有id
	if(id!==undefined){
		console.log('test')
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			//underscore模块的extend方法可以将两个对象的字段重合
			_movie=_.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/'+movie._id)
			})
		})
	}
	else{
		_movie=new Movie({
			doctor:movieObj.doctor,
			country:movieObj.country,
			title:movieObj.title,
			year:movieObj.year,
			poster:movieObj.poster,
			flash:movieObj.flash,
			language:movieObj.language,
			summary:movieObj.summary,
		})
		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}
			res.redirect('/movie/'+movie._id)
		})
	}
})

//list delet
app.delete("/admin/list",function(req,res){
	var id=req.query.id
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err) console.log(err)
			else{
				res.json({success:1})
			}
		})
	}
})






 