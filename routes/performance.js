var express        = require('express');
var router         = express.Router({mergeParams: true});;
var methodOverride = require("method-override");
var passport       = require('passport');
var flash          = require('connect-flash');
var mysql          = require('mysql');
var busboy         = require("then-busboy"); 
var fileUpload     = require('express-fileupload');                    
var JSZip          = require('jszip');                     
var fs             = require('fs');                     

var dbconfig       = require('../config/database');
// ==============_ Model+MiddleWare _=================
var middleware     = require("../middleware/index.js");
const { query }    = require('express');
// ==============ROUTER CONFIg=========================
var router=express.Router({mergeParams: true});;
router.use(methodOverride("_method"));
router.use(flash());

//-----------------------------------------------------------------------------performance view GET------------------------WORKING----
// router.get("/:id", middleware.isLoggedIn, function(req,res){
//     console.log("add  performance");
//     // console.log(req.params);
// 	// message = "format required, '.png','.gif','.jpg'";
// 	res.render("./performance/view.ejs",{user:req.user,params:req.params});
// });



router.get("/:id/view",middleware.isLoggedIn,function(req,res){
	console.log("view  performance");
	// res.render("./performance/view.ejs",{user:req.user,params:req.params});
	console.log(req.params.id); //Tid

	async function getInfo() {
		var query     = 'select * from asisstant where id=?';
		let assistant_data = await queryExecute(query ,[req.params.id]) ;

		var marks = [];
		for(var i=0;i<10;i++){
			var query2     = 'select * from checks inner join submission on submission.id = checks.Subid where Tid=? and ?<submission.marks and submission.marks<=?;';
			let marks_data = await queryExecute(query2 ,[req.params.id, 10*i, 10*i + 10]);

	        console.log("marks_data: "+ JSON.stringify(marks_data));
	        console.log(marks_data.length);
			marks.push(marks_data.length);
		}
		console.log(assistant_data);
    	if(assistant_data.length == 0 || assistant_data == undefined || assistant_data == null){
    	  	throw "asisstant not found :ERROR";
    	}
	    else{
	      console.log("assistant_data: "+ JSON.stringify(assistant_data));
	      var query2     = 'select * from checks inner join student on checks.Sid=student.id where checks.Tid = ?';
		  let students = await queryExecute(query2 ,[req.params.id]) ;
          console.log("bache:-", students);

          var query3     = 'select * from assigned inner join under on under.Tid=assigned.Tid where under.Pid = ? and under.Tid=?';
		  let assns = await queryExecute(query3 ,[req.user.id,req.params.id]) ;
          console.log("marks_data: "+ JSON.stringify(assns));
          console.log("bache:-", assns);
          res.render("./performance/view.ejs", {user:req.user, assistant_data:assistant_data[0], marks_data:marks, students:students, assns:assns});
	   	}
  	}

	getInfo().catch((message) => { 
    	console.log(message);
    	res.render("./error.ejs" ,{error:message});
    });

});


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