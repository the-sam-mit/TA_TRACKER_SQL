var express        = require('express');
var router         = express.Router({mergeParams: true});;
var methodOverride = require("method-override");
var passport       = require('passport');
var flash          = require('connect-flash');
var mysql          = require('mysql');
var dbconfig       = require('../config/database');
const path        = require('path');
// ==============_ Model+MiddleWare _=================
var middleware     = require("../middleware/index.js");
const { query }    = require('express');
// ==============ROUTER CONFIg=========================
var router=express.Router({mergeParams: true});;
router.use(methodOverride("_method"));
router.use(flash());


router.use(express.static(path.join(__dirname, 'public')));

// ================Module inport========================
var  AssignmentRoutes = require('./assignment.js');
var  PerformanceRoutes = require('./performance.js');
//-------------Landing GET------------------------WORKING----
router.get("/test",function(req,res){
	res.render("./index.html");
})
router.get("/",middleware.isLoggedIn,function(req,res){
	console.log(" courses list ! ");
	async function courseListS() {
		// Course--FindById 
		// var query = 'SELECT * FROM `course`';
		var query = 'select * from course where id NOT IN (select Cid from takes where Sid = ?)';
		let course_data_Avail = await queryExecute(query ,[req.user.id]) ;
		if( course_data_Avail == undefined || course_data_Avail == null){
			throw "course not found error";
		}
		
		query     = 'select * from course inner join takes on course.id = takes.Cid where Sid= ?';
		let course_data_Joined = await queryExecute(query ,[req.user.id]) ;
		if( course_data_Joined == undefined || course_data_Joined == null){
			throw "course not found error";
		}
		else{
			console.log("landing S route res")
			// res.render("./landing.ejs", {user:req.user, courseList_Avail:course_data_Avail, courseList_Joined:course_data_Joined});
			res.render("./landing.ejs", {user:req.user, courseList_Avail:course_data_Avail, courseList_Joined:course_data_Joined});
		}
	}
	async function courseListA() {
		// Course--FindById 
		var query     = 'select * from course LEFT JOIN manage on manage.Cid = course.id where Tid = ?';
		let course_data_Joined = await queryExecute(query ,[req.user.id]) ;
		console.log(" landing P: "+ course_data_Joined.length);
		if( course_data_Joined == undefined || course_data_Joined == null){
			throw "courses not found error";
		}
		query     = 'select * from course where id NOT IN (select Cid from manage where Tid = ?)';
		let course_data_Avail = await queryExecute(query ,[req.user.id]) ;
		if( course_data_Avail == undefined || course_data_Avail == null){
			console.log("ERROR landing: "+ course_data_Avail.length);
			throw "course not found error";
		}
		else{
			console.log("landing A route res")
			res.render("./landing.ejs", {user:req.user, courseListAvail:course_data_Avail, courseListJoined:course_data_Joined });
		}
	}
	async function courseListP() {
		// Course--FindById 
		const query     = 'select distinct * from course inner join teaches on course.id = teaches.Cid where Pid = ?';
		let course_data = await queryExecute(query ,[req.user.id]) ;
		console.log(" landing P: "+ course_data.length);
		if( course_data == undefined || course_data == null){
			throw "courses not found error";
		}
		else{
			console.log("list route res")
			res.render("./landing.ejs", {user:req.user, courseList:course_data});
		}
	}
	switch(req.user.type) {
		case "Student":
			courseListS().catch((message) => { 
				console.log(message);
				res.render("./error.ejs" ,{error:"Internal Error: Unable to List the Course"});
			});
			break;
		case "Asisstant":
			courseListA().catch((message) => { 
				console.log(message);
				res.render("./error.ejs" ,{error:"Internal Error: Unable to List in the Course"});
			});
		  break;
		case "Professor":
			courseListP().catch((message) => { 
				console.log(message);
				res.render("./error.ejs" ,{error:"Internal Error: Unable to List in the Course"});
			});
		  break;
		default: res.redirect("/courses");
	  }
});

//-------------JOIN COURSE POST---------------------WORKING-------
router.post("/:id/join",middleware.isLoggedIn,function(req,res){
	// Form Post route redirected to /course/id
	console.log(" JOin course  route ! "+JSON.stringify(req.body));	
	var code        = req.body.code;
	async function takesInsert() {
		// SID ,CID insert into takes 
		var query       = 'SELECT * FROM `course` where id = ?';
		let course_data = await queryExecute(query ,[req.params.id]) ;
		console.log("CODE1: "+ course_data[0].code);
		if(course_data != null && course_data != undefined && code === course_data[0].code){
			var query    = "INSERT INTO takes(Sid, Cid) VALUES (?,?)";
			const params = [req.user.id, req.params.id];
			let result   = await queryExecute(query ,params);
			res.redirect("/courses/"+req.params.id);
		}
		else{
			throw "Course Not Found";
		}
	}
	async function under_manage_Insert() {
		// TID ,PID insert into under 
		var query       = 'SELECT * FROM `course` where id = ?';
		let course_data = await queryExecute(query ,[req.params.id]) ;
		console.log("CODE2: "+ course_data[0].code);
		
		if(course_data != null && course_data != undefined && code === course_data[0].code){
			var query     = "select distinct Pid from teaches where Cid = ?";
			var params    = [req.params.id];
			let result1   = await queryExecute(query ,params);
			const Pid = result1[0].Pid;
			
			query     = "INSERT INTO under(Tid, Pid) VALUES (?,?)";
			params    = [req.user.id, Pid];
			let result2   = await queryExecute(query ,params);
			console.log("under table inserted")
			
			query         = "INSERT INTO manage(Tid, Cid) VALUES (?,?)";
			params        = [req.user.id, req.params.id];
			let result3   = await queryExecute(query ,params);
			console.log("manage table inserted")
			
			res.redirect("/courses/"+req.params.id);
		}
		else{
			throw "Course Not Found";
		}
	}
	switch(req.user.type) {
		case "Student":
			takesInsert().catch((message) => { 
				console.log(message);
				res.render("./error.ejs" ,{error:"Internal Error: Unable to join the Course"});
			});
			break;
			case "Asisstant":
				under_manage_Insert().catch((message) => { 
					console.log(message);
					res.render("./error.ejs" ,{error:"Internal Error: Unable to join the Course"});
				});
		  break;
		default: res.redirect("/courses");
	  }
	
});

//-------------SAVE COURSE POST---------------------WORKING-------
router.post("/new",middleware.isLoggedIn,function(req,res){
	// Form Post route redirected to /course
	console.log(" new course add route ! ");	
		var name       = req.body.name;
		var semester   = req.body.semester;
		var year       = req.body.year;
		var stream     = req.body.stream;
		var courseCode = makeid(10);
		async function courseCreate() {
			// Course--SAVE  COURSE | TAKES --pid cid
			var query    = "INSERT INTO course(name, semester, year, stream, code) VALUES (?,?,?,?,?)";
			var params = [name,semester,year,stream,courseCode];
			let result1 = await queryExecute(query ,params) ;
			query    = "INSERT INTO teaches(Pid, Cid) VALUES (?,?)";
			params = [req.user.id, result1.insertId];
			let result2 = await queryExecute(query ,params) ;
			// console.log(result2)
			res.redirect("/courses/"+result1.insertId);
		}
		courseCreate().catch((message) => { 
			console.log(message);
			res.render("./error.ejs" ,{error:"Internal Error: update could not be processed"});
		});
});

// --------------NEW COURSE ADD GET------------------WORKING--------
router.get("/new",middleware.isLoggedIn,function(req,res){
		console.log("reached adding !!");
		res.render("./course/create.ejs");
});

// --------------Show Info COURSE GET ----------------WORKING----------
router.get("/:id",middleware.isLoggedIn,function(req,res){
	console.log("info of id "+req.params.id);
	async function showInfo() {
		// Course--FindById 
		var query     = 'SELECT * FROM `course` where id = ?';
		let course_data = await queryExecute(query ,[req.params.id]) ;
		if(course_data.length == 0 || course_data == undefined || course_data == null){
			throw "course not found error";
		}
		else{
			// professor data
			query     = 'select * from professor inner join teaches on professor.id = teaches.Pid where teaches.Cid = ?';
			let professor_data = await queryExecute(query ,[req.params.id]) ;
			
			// student data 
			query     = 'select * from student inner join takes on student.id = takes.Sid where takes.Cid = ?';
			let student_data = await queryExecute(query ,[req.params.id]) ;
			
			// asisstant data
			query     = 'select * from asisstant inner join manage on asisstant.id = manage.Tid where manage.Cid = ?';
			let asisstant_data = await queryExecute(query ,[req.params.id]) ;
			
			// assignment data
			query     = 'select * from assignment inner join include on assignment.id = include.Aid where include.Cid = ?';
			let assignment_data = await queryExecute(query ,[req.params.id]) ;
			
			// assigned data
			query     = 'select * from assignment inner join assigned on assignment.id = assigned.Aid where assigned.Tid=?';
			let assigned_data = await queryExecute(query ,[req.user.id]) ;

			if(req.user.type === "Asisstant" && (assigned_data != null && assigned_data != undefined && assigned_data.length != 0)){
				assignment_data = assigned_data;
				res.render("./course/Coursedashboard.ejs", {user:req.user, course_data:course_data[0], professor_data:professor_data, student_data:student_data, asisstant_data:asisstant_data, assignment_data:assignment_data});
			}
			else{
				res.render("./course/Coursedashboard.ejs", {user:req.user, course_data:course_data[0], professor_data:professor_data, student_data:student_data, asisstant_data:asisstant_data, assignment_data:assignment_data});
			}
		}
	}
	showInfo().catch((message) => { 
		console.log(message);
		res.render("./error.ejs" ,{error:message});
	});
});

// --------------Edit COURSE EDIT(GET) ----------------WORKING----------
router.get("/:id/edit",middleware.isLoggedIn,function(req,res){
	console.log("info of id "+req.params.id);
	async function courseInfo() {
		// Course--FindById 
		const query     = 'SELECT * FROM `course` where id = ?';
		let course_data = await queryExecute(query ,[req.params.id]) ;
		if(course_data.length == 0 || course_data == undefined || course_data == null){
			throw "course not found error";
		}
		else{
			console.log("edit route res")
			res.render("./course/edit.ejs", {user:req.user, course_data:course_data});
		}
	}
	courseInfo().catch((message) => { 
		console.log(message);
		res.render("./error.ejs" ,{error:message});
	});
});

// -------------- Update  COURSE PUT-----------------WORKING---------
router.put("/:id",middleware.isLoggedIn,function(req,res){
	console.log("course put");
		var name       = req.body.name;
		var semester   = req.body.semester;
		var year       = req.body.year;
		var stream     = req.body.stream;
		const newCourse= [name,semester,year,stream];
	async function courseUpdate() {
		// Course--update 
		const query  = `UPDATE course SET name = ?, semester = ?, year = ?, stream = ? WHERE id = ?`;
		const params = [name, semester, year, stream, req.params.id];
		let result = await queryExecute(query ,params) ;
		res.redirect("/courses/"+req.params.id);
	}
	courseUpdate().catch((message) => { 
		console.log(message);
		res.render("./error.ejs" ,{error:"Internal Error: update could not be processed"});
	});
});

// -------------- Delete  COURSE DEL(GET) ------------------WORKING--------
router.get("/:id/delete",middleware.isLoggedIn,function(req,res){
	console.log("DELETE COURSE");
	async function courseDelete() {
		// Course--delete 
		const query = `DELETE FROM course WHERE id = ?`;
		const params = [req.params.id];
		let result = await queryExecute(query ,params) ;
		res.redirect("/courses/");
	}
	courseDelete().catch((message) => { 
		console.log(message);
		res.render("./error.ejs" ,{error:"Internal Error: course could not be deleted"});
	});
});

// FUNCTIONS
function makeid(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }
router.use("/:id/performance",PerformanceRoutes);
router.use("/:id/assignment",AssignmentRoutes);
module.exports=router;

// FUNCTION TO INTIATE QUERY
function queryExecute(query, params) {
	return new Promise(function(resolve, reject) {
		let con = mysql.createConnection(dbconfig.connection);
		con.connect(function(err) {
			if (err) throw err;
		});
		con.query(query, params, function (err, result, fields) {
			if (err) throw err;
			// console.log(result);
			// console.log(JSON.stringify(fields));
			console.log(JSON.stringify(result));
			con.end();
			resolve(result);
		});
	})
}
