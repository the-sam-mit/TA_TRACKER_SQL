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

//-----------------------------------------------------------------------------submissions import GET------------------------WORKING----
router.get("/add", middleware.isLoggedIn, function(req,res){
	console.log("add  rubrics");
	message = "format required, '.png','.gif','.jpg'";
	res.render("./rubrics/upload.ejs",{message: message});

});

// //-----------------------------------------------------------------------------submissions import POST------------------------WORKING----
router.post("/add", middleware.isLoggedIn, function(req,res){
	console.log("adding rubrics");
	var post  = req.body;

      if (!req.files)
          return res.status(400).send('No files were uploaded.');

      var file = req.files.uploaded_image;
      var img_name= file.name;
      var fs = require("fs");
      var JSZip = require("jszip");
      const unzipper = require('unzipper');
      var Path = require('path');
      var mysql      = require('mysql');
                        console.log(__basedir);

       if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif"|| file.mimetype == "text/plain" ||  file.mimetype == "application/zip" )
       {
                                 
              file.mv('public/Rubrics/'+file.name, function(err) 
              {
                             
                  if (err)
                    return res.status(500).send(err);
                  
                                
                         async function unzip() {
                      
                         fs.createReadStream("public/Rubrics/"+file.name)
                        .pipe(unzipper.Extract({ path: 'public/Rubrics/' }));
                        console.log("a");
                   // })
                  }


                     async function storeinDB() {
                     console.log("b");

                        var tmp= file.name;
                        var folder = tmp.substr(0, tmp.lastIndexOf('.'));
                        var url= __basedir+"/public/Rubrics/"+ folder +"/";

                        console.log("c");
                        // var query= "SELECT `id`,`username` from `student`";
                        // var params= [];
                        // let result = await queryExecute(query ,params) ;
                      
                        // var dict={};
                      
                        // var len= result.length;
                        // for(var i=0;i<len;i++)
                        // {
                        //    var obj= result[i];
                        //    var id= obj["id"];
                        //    var username= obj["username"];
                        //    dict[username]= id;
                        //    //console.log(id);
                        //    //console.log(username);
                        // }

                        // console.log("entry in submission table inserted");

                        // fs.readdir(url, function (err, files) {
                    
                        //     if (err) {
                        //         return console.log('Unable to scan directory: ' + err);
                        //     } 
                        //      console.log("d");
                        //     files.forEach(async function (file) {
                                
                        //         var a_name= file; 
                        //         //console.log(A_name); 
                        //         var a_path= url+ a_name;
                        //         var courseID= 4; 
                        //         //var sql = "INSERT INTO `submission`(`assignment_name`,`assignment_path`,`Cid`) VALUES ('" + A_name + "','" + A_path + "','" + C_id +")";
                                   
                        //            // query for submission table
                        //         var query= "INSERT INTO `submission`(`Cid`,`a_name`,`a_path`) VALUES (?,?,?)";
                        //         var params= [courseID,a_name,a_path];
                        //         let result1 = await queryExecute(query ,params) ;
                        //         console.log("entry in submission table inserted");

                                  
                        //           // query for assign table
                        //         var query= "INSERT INTO `assign`(`Sid`,`Tid`) VALUES (?,?)";
                        //         var username= a_name.substr(0, a_name.lastIndexOf('.'));
                        //         var sid= dict[username];
                        //         var tid= 123;
                        //         var params= [sid,tid];
                        //         let result2 = await queryExecute(query ,params) ;
                        //         console.log("entry in assign table inserted");
                        //     });
                        // });
                    // })
                  }                  

                  function func3()
                  {
                       unzip();
                       //storeinDB();
                       setTimeout(storeinDB,3000);
                  }
                  
                  func3();

              });
        } 
        else 
        {
             message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
             res.render('index.ejs',{message: message});
        }

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
