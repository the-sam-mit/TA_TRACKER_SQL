var mongoose=require('mongoose');
var passportLocalMongoose=require('passport-local-mongoose');

var UserSchema= new mongoose.Schema({
	username:String,
	password:String,
	userType: {type:String,default:"Professor"},
	courseList:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:  'Course'
		}
	],
	assistantList:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:  'Assistant'
		}
	]
});
//Gives default functionality required for auth
UserSchema.plugin(passportLocalMongoose);

var User=mongoose.model("Professor",UserSchema);
module.exports=User;