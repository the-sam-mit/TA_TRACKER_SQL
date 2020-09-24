var mongoose=require('mongoose');
var passportLocalMongoose=require('passport-local-mongoose');

var UserSchema= new mongoose.Schema({
	username:String,
	password:String,
	userType: {type:String,default:"Assistant"},
	course :
	{
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : "Course"
		   },
         name:String,
         courseCode: String
    },
    professor :
	{
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : "Professor"
		   },
		 name:String
	},
});
//Gives default functionality required for auth
UserSchema.plugin(passportLocalMongoose);

var User=mongoose.model("Assistant",UserSchema);
module.exports=User;