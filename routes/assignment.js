var express=require('express');
var router=express.Router({mergeParams: true});;
var methodOverride=require("method-override");
var passport=require('passport');
var flash=require('connect-flash');
var mysql      = require('mysql');
var dbconfig   = require('../config/database');

// ==============_ Model+MiddleWare _=================
var middleware        = require("../middleware/index.js");
var  SubmissionRoutes = require('./submission.js');
var  RubricsRoutes     = require('./rubrics.js');

const { query } = require('express');
// ==============ROUTER CONFIg=========================
var router=express.Router({mergeParams: true});;
router.use(methodOverride("_method"));
router.use(flash());

// //-----------------------------------------------------------------------------new assignment GET------------------------WORKING----
router.get("/new",middleware.isLoggedIn,function(req,res){
	console.log(" assignment new get ! ");
	let availableTA = {};
	let assignedTA = [];
	var current_datetime =  new Date().toISOString().slice(0, 19);
	//retrieve course data and TA data
	async function getdata_course_ta() {
		// Course--FindById 
		var query     = 'SELECT * FROM `course` where id = ?';
		let course_data = await queryExecute(query ,[req.params.id]) ;
		if(course_data.length == 0 || course_data == undefined || course_data == null){
			throw "course not found error";
		}
		else{
			var query     = 'SELECT manage.Tid, asisstant.username FROM manage INNER JOIN asisstant on asisstant.id = manage.Tid  where manage.Cid = ?';
			let ta_data   = await queryExecute(query ,[req.params.id]) ;
			console.log("TA DATA: "+ta_data[0]);
			ta_data.forEach(function(data){
				availableTA[data.username] = data.Tid;
			});
			res.render("./assignment/create.ejs", {user:req.user, course:course_data[0], asisstant:ta_data, current_datetime:current_datetime});
		}
	}
	getdata_course_ta().catch((message) => { 
		console.log(message);
		res.render("./error.ejs" ,{error:message});
	});
});

//--------------------------------------------------------------------------create NEW ASSIGNMENT POST---------------------WORKING-------
router.post("/new",middleware.isLoggedIn,function(req,res){
	// Form Post route redirected to /course
	console.log(" new assignment add route ! ");	
		var name               = req.body.name;
		var course             = req.body.course;
		var type               = req.body.Type;
		console.log("REQ: " + req.body.deadlineRubriks)
		var deadlineRubriks    = req.body.deadlineRubriks.slice(0, 19).replace('T', ' ');
		var deadlineEvaluation = req.body.deadlineEvaluation.slice(0, 19).replace('T', ' ');
		var assignedTA         = req.body.assignedTA;
		var created_at         =  new Date().toISOString().slice(0, 19).replace('T', ' ');

			// Assignment--SAVE  
		async function AssignmentCreate() {

			//insert into assignment table
			var query    = "INSERT INTO assignment(name, course, type, created_at, deadline_rubriks, deadline_eval) VALUES (?,?,?,?,?,?)";
			var params = [name,course,type,created_at,deadlineRubriks,deadlineEvaluation];
			let insert_assignment = await queryExecute(query ,params) ;

			if(insert_assignment.affectedRows == 0)
				throw "Assignment insertion failed";

			//insert into assigned table AID TID
			console.log("assignedTA: "+assignedTA);
			params = await make_Aid_Tid(insert_assignment.insertId, assignedTA);
			console.log("params: "+JSON.stringify(params));
			console.log("params: "+params.length);
			console.log("params: "+params[0]);
			console.log("params: "+params[1]);
			if(params.length >0){
				query    = "INSERT INTO assigned(Aid, Tid) VALUES ?";
				let insert_assigned = await queryExecute(query ,[params]) ;
			}

			//insert into include table AID CID
			query    = "INSERT INTO include(Aid, Cid) VALUES (?,?)";
			params   = [insert_assignment.insertId, req.params.id]
			let insert_include = await queryExecute(query ,params) ;

			// redirecting to new assignment
			res.redirect(`/courses/${req.params.id}/assignment/${insert_assignment.insertId}`);
		}
		AssignmentCreate().catch((message) => { 
			console.log(message);
			res.render("./error.ejs" ,{error:"Internal Error: Assignement Creation could not be processed"});
		});
});


// -----------------------------------------------------------------------------------Show Info Assignment GET ----------------WORKING----------
router.get("/:Aid",middleware.isLoggedIn,function(req,res){
	console.log("info of Aid "+req.params.Aid);
	async function showInfo() {
		// ASsignment--FindById 
		var query     = 'SELECT * FROM `assignment` where id = ?';
		let assignment_data = await queryExecute(query ,[req.params.Aid]);
		if(assignment_data.length == 0 || assignment_data == undefined || assignment_data == null)
		{
			throw "assignment not found :ERROR";
		}
		else
		{
			//  assigned  AID TID
			query     = 'select * from asisstant inner join assigned on asisstant.id = assigned.Tid where assigned.Aid = ?';
			let asisstant_data = await queryExecute(query ,[req.params.Aid]) ;

			console.log("Assignment: "+ JSON.stringify(assignment_data));
			console.log("Asisstant: "+ JSON.stringify(asisstant_data));

			//rubriks get
			var query     = 'select * from rubrics_image where a_id = ? and t_id=?';
			let rubrics_data = await queryExecute(query ,[req.params.Aid, req.user.id]) ;
		
			// for view submission
			var query1   = "select * from `submission`";
	        var params1  = [];
	        let submit_data = await queryExecute(query1 ,params1) ;
	        if(submit_data.length == 0 || submit_data == undefined || submit_data == null)
	        {
	           //throw "no submissions found :ERROR";
	            var submission_data= []; 
	            if(req.user.type === "Professor")
	            {

	            	res.render("./assignment/info.ejs", {user:req.user,CID:req.params.id, assignment_data:assignment_data[0],asisstant_data:asisstant_data,submission_data:submission_data, rubrics_data:rubrics_data[0]});
	            }
	            else if(req.user.type === "Asisstant")
	            {
	            	var query2     = 'select * from checks inner join student on checks.Sid=student.id where checks.Tid = ?';
					let students = await queryExecute(query2 ,[req.user.id]) ;
					res.render("./assignment/info_TA.ejs", {user:req.user,CID:req.params.id, assignment_data:assignment_data[0],asisstant_data:asisstant_data,submission_data:submission_data,students:students,rubrics_data:rubrics_data[0]});
	            }
	            else if(req.user.type === "Student")
	            {
                    res.render("./assignment/info_Student.ejs", {user:req.user,CID:req.params.id, assignment_data:assignment_data[0],asisstant_data:asisstant_data,submission_data:submission_data});
	            }
	        }
	        else
	        {
		        if(req.user.type === "Professor")
				{
					query = 'SELECT *, student.name as s_name, asisstant.name as ta_name, submission.id as sub_id from checks \
		                     inner join submission on checks.Subid = submission.id \
		                     inner join student on checks.Sid = student.id \
		                     inner join asisstant on checks.Tid = asisstant.id\
		                     where submission.Aid = ?';
				    
				    var params= [req.params.Aid];
				    var submission_data = await queryExecute(query,params);
					res.render("./assignment/info.ejs", {user:req.user,CID:req.params.id, assignment_data:assignment_data[0],asisstant_data:asisstant_data,submission_data:submission_data,rubrics_data:rubrics_data[0]});
				}
				else if(req.user.type === "Asisstant")
				{
					query = 'SELECT *, student.name as s_name, asisstant.name as ta_name, submission.id as sub_id  from checks \
		                     inner join submission on checks.Subid = submission.id \
		                     inner join student on checks.Sid = student.id \
		                     inner join asisstant on checks.Tid = asisstant.id\
		                     where asisstant.id = ? and submission.Aid = ?';
				    
				    var params= [req.user.id,req.params.Aid];
				    var submission_data = await queryExecute(query,params);

				    var query2     = 'select * from checks inner join student on checks.Sid=student.id where checks.Tid = ?';
					let students = await queryExecute(query2 ,[req.user.id]) ;
					res.render("./assignment/info_TA.ejs", {user:req.user,CID:req.params.id, assignment_data:assignment_data[0],asisstant_data:asisstant_data,submission_data:submission_data,students:students,rubrics_data:rubrics_data[0]});
	                
				}
				else if(req.user.type === "Student")
				{
					query = 'SELECT *, student.name as s_name, asisstant.name as ta_name, submission.id as sub_id  from checks \
		                     inner join submission on checks.Subid = submission.id \
		                     inner join student on checks.Sid = student.id \
		                     inner join asisstant on checks.Tid = asisstant.id\
		                     where student.id = ? and submission.Aid = ?';
				    
				    var params= [req.user.id,req.params.Aid];
				    var submission_data = await queryExecute(query,params);
					res.render("./assignment/info_Student.ejs", {user:req.user,CID:req.params.id, assignment_data:assignment_data[0],asisstant_data:asisstant_data,submission_data:submission_data});
				}
	        }
		}
	}
	showInfo().catch((message) => { 
		console.log(message);
		res.render("./error.ejs" ,{error:message});
	});
});

router.get("/:Aid/update",middleware.isLoggedIn,function(req,res){
	console.log("info of Aid "+req.params.Aid);
	async function showInfo() {
		// ASsignment--FindById 
		var query     = 'SELECT * FROM `assignment` where id = ?';
		let assignment_data = await queryExecute(query ,[req.params.Aid]) ;
		if(assignment_data.length == 0 || assignment_data == undefined || assignment_data == null){
			throw "assignment not found :ERROR";
		}
		else{
			//  assigned  AID TID
			res.render("./assignment/edit.ejs", {user:req.user,assignment_data:assignment_data[0],CID:req.params.id});
		}
	}
	showInfo().catch((message) => { 
		console.log(message);
		res.render("./error.ejs" ,{error:message});
	});
});

router.post("/:Aid/update",middleware.isLoggedIn,function(req,res){
	console.log("info of Aid "+req.params.Aid);
	var name               = req.body.name;
	var deadlineRubriks    = req.body.deadlineRubriks.slice(0, 19).replace('T', ' ');
	var deadlineEvaluation = req.body.deadlineEvaluation.slice(0, 19).replace('T', ' ');
	
	async function updateAssignment() {
		// ASsignment--FindById 
		var query     = 'UPDATE `assignment` SET name = ?, deadline_rubriks= ?, deadline_eval = ? where id = ?';
		let updated   = await queryExecute(query ,[name, deadlineRubriks, deadlineEvaluation, req.params.Aid]) ;
		res.redirect(`/courses/${req.params.id}/assignment/${req.params.Aid}`);
	}
	updateAssignment().catch((message) => { 
		console.log(message);
		res.render("./error.ejs" ,{error:message});
	});
});

// marks updates
router.post("/:Aid/marksupdate/:SSid",middleware.isLoggedIn,function(req,res){
	console.log("hi there----------------------------------------------------------------------------------------------------------------------------------------------------");
	console.log(req.body.marks);
	console.log(req.params.SSid);
	async function updateMarks() {
		var query     = 'UPDATE `submission` SET marks = ? where id = ?';
		let updated   = await queryExecute(query ,[req.body.marks, req.params.SSid]) ;
		res.redirect(`/courses/${req.params.id}/assignment/${req.params.Aid}`);
	}
	updateMarks().catch((message) => { 
		console.log(message);
		res.render("./error.ejs" ,{error:message});
	});
	res.redirect(`/courses/${req.params.id}/assignment/${req.params.Aid}`);	
});
// -------------

// REFATORING --------------------from assignment to submission and rubrics
router.use("/:Aid/submission",SubmissionRoutes);
router.use("/:Aid/rubrics",RubricsRoutes);


// ------------------------------------------END ROUTES------------------------------------------------
module.exports=router;

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
// FUNCTION TO INTIATE QUERY
function queryExecute(query, params) {
	return new Promise(function(resolve, reject) {
		let con = mysql.createConnection(dbconfig.connection);
		con.connect(function(err) {
			if (err) throw err;
		});
		con.query(query, params, function (err, result, fields) {
			if (err) throw err;
			console.log(result);
			console.log(JSON.stringify(result));
			con.end();
			resolve(result);
		});
	})
}

// making relation AID CID TID
function make_Aid_Tid(AID, TA){
	return new Promise(function(resolve, reject) {
			// if (err) throw err;
		let list = [];
		for(var i=0;i<TA.length ;i++){
			var l = [];
			l[0] = AID;
			l[1] = parseInt(TA[i]);
			list.push(l);
		}
		console.log("LENGTH: "+list.length);
		resolve(list);
	})
}
