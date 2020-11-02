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

// //-----------------------------------------------------------------------------rubrics upload GET & POST------------------------WORKING----
router.get("/add",middleware.isLoggedIn,function(req,res){
	console.log("add  rubrics");
	console.log(req.params);
	message = "format required, '.png','.gif','.jpg'";
	res.render("./rubrics/upload.ejs",{message: message,user:req.user,params:req.params}); // more parameters are to be added.
});

router.get("/view",middleware.isLoggedIn,function(req,res){
	console.log("view  rubrics");

	async function getInfo() {
		var query     = 'select * from rubrics_image where a_id = ? and t_id=?';
		let rubrics_data = await queryExecute(query ,[req.params.Aid, req.user.id]) ;
    	if(rubrics_data.length == 0 || rubrics_data == undefined || rubrics_data == null || (rubrics_data[0].approved == 0 && req.user.type == "Student")){
			  req.flash("warning", "rubrics not found");
			  res.redirect(`/courses/${req.params.id}/assignment/${req.params.Aid}/`);
    	}
	    else{
		  console.log("rubrics_data: "+ JSON.stringify(rubrics_data));
		  
          res.render("./rubrics/view.ejs", {user:req.user,CID:req.params.id, rubrics_data:rubrics_data[0]});
	   	}
  	}

	getInfo().catch((message) => { 
    	console.log(message);
    	res.render("./error.ejs" ,{error:message});
    });

});

router.post("/adds", middleware.isLoggedIn, function(req,res){
	console.log("adding rubrics");
	console.log(req.user);
      if (!req.files)
          return res.status(400).send('No files were uploaded.');

      var file = req.files.uploaded_image;
      var img_name= file.name;

       if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "application/pdf"|| file.mimetype == "text/plain" ||  file.mimetype == "application/zip" )
       {
                                 
              file.mv('public/Rubrics/'+file.name, function(err) 
              {
                  if (err)
					return res.status(500).send(err);
					console.log(file);
					var current_datetime =  new Date().toISOString().slice(0, 19).replace('T', ' ');
					console.log("dates");
					console.log(current_datetime);
					var query = "INSERT INTO rubrics_image(c_id,a_id,t_id,image,date_time) VALUES (?,?,?,?,?)";;
					let insert_assigned = queryExecute(query ,[req.params.id,req.params.Aid,req.user.id,file.name,current_datetime]);
					req.flash("success", "rubrics uploaded successfully");
					res.redirect(`/courses/${req.params.id}/assignment/${req.params.Aid}/`);
			  });
		}

		async function addFile() {
			
		}
		addFile().catch((message) => { 
			console.log(message);
			res.render("./error.ejs" ,{error:message});
		});
});

// APPROVE ROUTES DONE----------------------------------------
router.post("/approve", middleware.isLoggedIn, function(req,res){
	console.log("APPROVED:::---DONE");

	async function getInfo_approved() {
		var query     = 'select * from rubrics_image where a_id = ? and t_id=?';
		let rubrics_data = await queryExecute(query ,[req.params.Aid, req.user.id]) ;
		console.log(rubrics_data);
    	if(rubrics_data.length == 0 || rubrics_data == undefined || rubrics_data == null){
			  req.flash("warning", "rubrics not found");
			  res.redirect(`/courses/${req.params.id}/assignment/${req.params.Aid}/`);
    	}
	    else{
			var query    = "UPDATE rubrics_image SET approved = ? where a_id = ?";;
			let insert_assigned = queryExecute(query ,[true,req.params.Aid]);
			req.flash("success", "rubrics approved");
			res.redirect(`/courses/${req.params.id}/assignment/${req.params.Aid}/rubrics/view`);
	   	}
  	}

	getInfo_approved().catch((message) => { 
    	console.log(message);
    	res.render("./error.ejs" ,{error:message});
	});
});

// DECLINE ROUTES DONE----------------------------------------
router.post("/decline", middleware.isLoggedIn, function(req,res){
	console.log("decline:::---DONE");

	async function delete_rubric() {
		var query  = 'DELETE FROM  rubrics_image where a_id = ? and t_id=?';
		let result    = await queryExecute(query ,[req.params.Aid, req.user.id]) ;
		req.flash("warning", "rubrics removed");	
		res.redirect(`/courses/${req.params.id}/assignment/${req.params.Aid}/`);
  	}
	delete_rubric().catch((message) => { 
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