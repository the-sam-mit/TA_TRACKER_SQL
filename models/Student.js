var mongoose=require('mongoose');
var passportLocalMongoose=require('passport-local-mongoose');

var UserSchema= new mongoose.Schema({
	username: String,
    password: String,
    semester: String,
    batch   : String,
	year    : String,
	userType: {type:String,default:"Student"},
	course :
	[{
		courseId : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : "Course"
		   },
		courseName: String,
		courseCode: String,
		professorId : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : "Professor"
		   },
		professorName: String
    }]
});
//Gives default functionality required for auth
UserSchema.plugin(passportLocalMongoose);

var User=mongoose.model("Student",UserSchema);
module.exports=User;