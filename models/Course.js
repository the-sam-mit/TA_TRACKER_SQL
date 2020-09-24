//Course SCHEMA
var mongoose=require('mongoose');
var CourseSchema= new mongoose.Schema({
	name        : String,
	image       : String,
	courseCode  : String,
	semester    : String,
	batch       : String,
	year        : String,
	description : {type:String,default:"No description provided"},
	professor :
	{
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : "Professor"
		   },
		 username:String
	},
	assistantList:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:  'Assistant'
		}
	],
	studentList:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:  'Student'
		}
	]
});
var CourseSchema=mongoose.model("Course",CourseSchema);
module.exports=CourseSchema;