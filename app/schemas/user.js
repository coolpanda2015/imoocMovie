var mongoose=require('mongoose');
//字段和类型
var bcrypt=require('bcrypt');
var SALT_WORK_FACTORY=10;

var UserSchema=new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:String,
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

UserSchema.pre('save',function(next){
	var user=this;
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now()		
	}
	else{
		this.meta.updateAt=Date.now()
	}
	bcrypt.genSalt(SALT_WORK_FACTORY,function(err,salt){
		if (err) return next(err);
		bcrypt.hash(user.password,salt,function(err,hash){
			if (err) return next(err); 
			user.password=hash;
			next();
		})
	})
})	

//定义实例方法
UserSchema.methods={
	comparePassword:function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if (err) return cb(err); 
			cb(null,isMatch);
		})
	}
}

UserSchema.statics={
	fetch:function(cb){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},
	findById:function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb)
	}
}

module.exports=UserSchema




 