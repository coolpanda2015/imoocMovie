var express = require('express');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var mongoose=require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore=require('connect-mongo')(session);//session持久化的中间件
var logger=require('morgan')

var port = process.env.PORT||3000;
var app = express();
var dbUrl='mongodb://localhost/imooc';

mongoose.connect(dbUrl)

app.set('views','./app/views/pages');
app.set('view engine','jade');
app.locals.moment=require("moment")
app.use(bodyParser.urlencoded({extended:true}))
app.use(serveStatic('public'))
app.use(cookieParser());//解析req.connect.sid成sessionid的中间件
app.use(session({
	secret:'imooc',
	store: new mongoStore({
		url:dbUrl,
		collection:'sessions'	
	})
}))

app.listen(port)
console.log('this is'+port)

if('development'===app.get('env')){
	app.set('showStackError',true) //是错误能够打印到屏幕上
	app.use(logger(':method :url :status')) //显示所有请求的方法、url和状态
	app.locals.pretty=true	//
	mongoose.set('debug',true) //mongodb显示进行的操作
}

require('./config/routes')(app)



 