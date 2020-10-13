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
router.get("/new",middleware.isLoggedIn,function(req,res){
	console.log(" assignment new ! ");
	console.log("info of id "+req.params.id);
	//retrieve course data
	async function showInfo() {
		// Course--FindById 
		var query     = 'SELECT * FROM `course` where id = ?';
		let course_data = await queryExecute(query ,[req.params.id]) ;
		if(course_data.length == 0 || course_data == undefined || course_data == null){
			throw "course not found error";
		}
		else{
			console.log('/assignment/create.ejs');
			res.render("./assignment/create.ejs", {user:req.user, course:course_data[0]});
		}
	}
	showInfo().catch((message) => { 
		console.log(message);
		res.render("./error.ejs" ,{error:message});
	});
});


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