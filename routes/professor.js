var express=require('express');
var router=express.Router({mergeParams: true});;
var methodOverride=require("method-override");
var passport=require('passport');
var flash=require('connect-flash');
var mysql      = require('mysql');
var dbconfig   = require('../config/database');

// ==============_ Model+MiddleWare _=================
var middleware  = require("../middleware/index.js");
const { query } = require('express');
// ==============ROUTER CONFIg=========================
var router=express.Router({mergeParams: true});;
router.use(methodOverride("_method"));
router.use(flash());

// //-------------Landing GET------------------------WORKING----
// router.get("/",middleware.isLoggedIn,function(req,res){
// 	console.log(" courses list ! ");
// 	let con = mysql.createConnection(dbconfig.connection);
// 	con.connect(function(err) {
// 		if (err) throw err;
		
// 	});
// 	const query = 'SELECT * FROM `course`';
// 		con.query(query, function (err, result, fields) {
// 			if (err) throw err;
// 			console.log(result);
// 			console.log(JSON.stringify(result));
// 			con.end();
// 			// res.send(JSON.stringify(result));
// 			res.render("./landing.ejs",{user: req.user, courseList:result});
// 		});
// });

// //-------------SAVE COURSE POST---------------------WORKING-------
// router.post("/new",middleware.isLoggedIn,function(req,res){
// 	// Form Post route redirected to /course
// 	console.log(" new course add route ! ");	
// 		var name       = req.body.name;
// 		var semester   = req.body.semester;
// 		var year       = req.body.year;
// 		var stream     = req.body.stream;
// 		var courseCode = makeid(10);
// 		const newCourse= [name,semester,year,stream,courseCode];
// 		let con = mysql.createConnection(dbconfig.connection);
// 		con.connect(function(err) {
// 			if (err) throw err;
// 		});
// 		var query = "INSERT INTO course(name, semester, year, stream, code) VALUES (?,?,?,?,?)";
// 		con.query(query, newCourse, function (err, result, fields) {
// 			if (err){
// 				console.log("course insert error");
// 				throw err;
// 			}
// 			console.log(result);
// 			console.log(JSON.stringify(result));
// 			con.end();
// 			res.redirect('/courses');
// 		});
// });

// // --------------NEW COURSE ADD GET------------------WORKING--------
// router.get("/new",middleware.isLoggedIn,function(req,res){
// 		console.log("reached adding !!");
// 		res.render("./course/create.ejs");
// });

// // --------------Show Info COURSE GET ----------------WORKING----------
// router.get("/:id",middleware.isLoggedIn,function(req,res){
// 	console.log("info of id "+req.params.id);
// 	async function showInfo() {
// 		// Course--FindById 
// 		const query     = 'SELECT * FROM `course` where id = ?';
// 		let course_data = await queryExecute(query ,[req.params.id]) ;
// 		if(course_data.length == 0 || course_data == undefined || course_data == null){
// 			throw "course not found error";
// 		}
// 		else{
// 			res.render("./course/info.ejs", {user:req.user, course_data:course_data});
// 		}
// 	}
// 	showInfo().catch((message) => { 
// 		console.log(message);
// 		res.render("./error.ejs" ,{error:message});
// 	});
// });

// // --------------Edit COURSE EDIT(GET) ----------------WORKING----------
// router.get("/:id/edit",middleware.isLoggedIn,function(req,res){
// 	console.log("info of id "+req.params.id);
// 	async function courseInfo() {
// 		// Course--FindById 
// 		const query     = 'SELECT * FROM `course` where id = ?';
// 		let course_data = await queryExecute(query ,[req.params.id]) ;
// 		if(course_data.length == 0 || course_data == undefined || course_data == null){
// 			throw "course not found error";
// 		}
// 		else{
// 			console.log("edit route res")
// 			res.render("./course/edit.ejs", {user:req.user, course_data:course_data});
// 		}
// 	}
// 	courseInfo().catch((message) => { 
// 		console.log(message);
// 		res.render("./error.ejs" ,{error:message});
// 	});
// });

// // -------------- Update  COURSE PUT-----------------WORKING---------
// router.put("/:id",middleware.isLoggedIn,function(req,res){
// 	console.log("course put");
// 		var name       = req.body.name;
// 		var semester   = req.body.semester;
// 		var year       = req.body.year;
// 		var stream     = req.body.stream;
// 		const newCourse= [name,semester,year,stream];
// 	async function courseUpdate() {
// 		// Course--update 
// 		const query  = `UPDATE course SET name = ?, semester = ?, year = ?, stream = ? WHERE id = ?`;
// 		const params = [name, semester, year, stream, req.params.id];
// 		let result = await queryExecute(query ,params) ;
// 		res.redirect("/courses/"+req.params.id);
// 	}
// 	courseUpdate().catch((message) => { 
// 		console.log(message);
// 		res.render("./error.ejs" ,{error:"Internal Error: update could not be processed"});
// 	});
// });

// // -------------- Delete  COURSE DEL(GET) ------------------WORKING--------
// router.get("/:id/delete",middleware.isLoggedIn,function(req,res){
// 	console.log("DELETE COURSE");
// 	async function courseDelete() {
// 		// Course--delete 
// 		const query = `DELETE FROM course WHERE id = ?`;
// 		const params = [req.params.id];
// 		let result = await queryExecute(query ,params) ;
// 		res.redirect("/courses/");
// 	}
// 	courseDelete().catch((message) => { 
// 		console.log(message);
// 		res.render("./error.ejs" ,{error:"Internal Error: course could not be deleted"});
// 	});
// });

// // FUNCTIONS
// function makeid(length) {
// 	var result           = '';
// 	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
// 	var charactersLength = characters.length;
// 	for ( var i = 0; i < length; i++ ) {
// 	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
// 	}
// 	return result;
//  }

// module.exports=router;

// // FUNCTION TO INTIATE QUERY
// function queryExecute(query, params) {
// 	return new Promise(function(resolve, reject) {
// 		let con = mysql.createConnection(dbconfig.connection);
// 		con.connect(function(err) {
// 			if (err) throw err;
// 		});
// 		con.query(query, params, function (err, result, fields) {
// 			if (err) throw err;
// 			console.log(result);
// 			console.log(JSON.stringify(result));
// 			con.end();
// 			resolve(result);
// 		});
// 	})
// }

module.exports=router;
