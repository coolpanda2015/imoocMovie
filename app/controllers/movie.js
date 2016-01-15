var Movie=require('../models/movie');
var _=require('underscore');
// detail page
exports.detail=function(req,res){
	var id=req.params.id

	Movie.findById(id,function(err,movie){
		if(err){
			console.log(err)	
		}
		res.render('detail',{
			title:'imooc详情页',
			movie:movie
		})	
	})
}
// list page
exports.list=function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list', {
			'title':'列表页',
			'movies':movies
		});
	})
}

//admin update 
exports.update=function(req,res){
	var id=req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'immooc 后台更新',
				movie:movie

			})
		})
	}
}
// admin page
exports.new=function(req,res){
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
}

//admin post
exports.save=function(req,res){
	var id = req.body.movie._id
	console.log('this is '+id)
	var movieObj=req.body.movie
	console.log(movieObj)
	var _movie;
	//非新加的电影没有id
	if(id!=='' && id!==undefined){
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
}

//list delet
exports.del=function(req,res){
	var id=req.query.id
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err) console.log(err)
			else{
				res.json({success:1})
			}
		})
	}
}