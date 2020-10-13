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

//-------------Landing GET------------------------WORKING----
router.get("/",middleware.isLoggedIn,function(req,res){
	console.log(" TA - students list ! ");
	
	async function courseListA() {
		// Course--FindById 
		console.log("ENTRY DEFINED");
		var query     = 'select * from course LEFT JOIN manage on manage.Cid = course.id where Tid = ?';
		let course_data_Joined = await queryExecute(query ,[req.user.id]) ;
		console.log(" landing P: "+ course_data_Joined.length);
		if( course_data_Joined == undefined || course_data_Joined == null){
			throw "courses not found error";
		}
		else{
			console.log("landing A route res")
			res.render("./landing_tas.ejs", {user:req.user, courseListJoined:course_data_Joined });
		}

		query     = 'select Sid from assigned_temp where Tid = ?';
		let allAssigned = await queryExecute(query ,[req.user.id]) ;
		console.log(allAssigned);
	}
	
	switch(req.user.type) {
		case "Asisstant":
			courseListA().catch((message) => { 
				console.log(message);
				res.render("./error.ejs" ,{error:"Internal Error: Unable to List in the Course"});
			});
		  break;
		default: res.redirect("/courses");
	  }
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
