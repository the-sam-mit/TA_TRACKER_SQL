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
const unzipper     = require('unzipper');
var Path           = require('path');
const path        = require('path');

var dbconfig       = require('../config/database');
// ==============_ Model+MiddleWare _=================
var middleware     = require("../middleware/index.js");
const { query }    = require('express');
// ==============ROUTER CONFIg=========================
var router=express.Router({mergeParams: true});;
router.use(methodOverride("_method"));
router.use(flash());

router.use(express.static(path.join(__dirname, 'public')));
//-----------------------------------------------------------------------------submissions import GET------------------------WORKING----
router.get("/import", middleware.isLoggedIn, function(req,res){
	console.log("import  submissions");
	message = "format required, '.png','.gif','.jpg'";
	res.render("./submission/upload.ejs",{message: message, Aid:req.params.Aid, Cid:req.params.id});

});

//-----------------------------------------------------------------------------submissions import POST------------------------WORKING----
router.post("/import", middleware.isLoggedIn, function(req,res){
	console.log("importing submissions");
	var post  = req.body;

  if (req.files == undefined)
    return res.status(400).send('No files were uploaded.');

  console.log(req.files+" "+req.files.length)
  var file = req.files.uploaded_image;
  var img_name= file.name;

  console.log(__basedir);
  let ta_submission= {};
  let submissions = [];
  let talist = [];

//unzip----------------------------------------------------
  async function unzip() {
    fs.createReadStream("public/Assignments/"+file.name)
      .pipe(unzipper.Extract({ path: 'public/Assignments/' }));
    console.log("a");
  }

//Store in DB----------------------------------------------------
  async function storeinDB() {
    console.log("b");

    var tmp= file.name;
    var folder = tmp.substr(0, tmp.lastIndexOf('.'));
    var url=`${__basedir}/public/Assignments/${folder}/`;

    console.log("c");
    var query= "SELECT `id`,`username` from `student`";
    var params= [];
    let result = await queryExecute(query ,params) ;

    var dict={};

    var len= result.length;
    for(var i=0;i<len;i++){
      var obj= result[i];
      var id= obj["id"];
      var username= obj["username"];
      dict[username]= id;
    }

    var query  = "SELECT `Tid` from `assigned` where Aid = ?";
    var params = [req.params.Aid];
    let TAlist = await queryExecute(query ,params) ;   
    for(var i=0;i<TAlist.length;i++){
      var obj= TAlist[i];
      var id= obj["Tid"];
      talist.push(id);
    }
    console.log("Got TA List: "+talist);

    let ta = 0;
    fs.readdir(url, function (err, files) {
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      } 
      console.log("d");
      console.log(files);
      console.log(files.length);
      var ta = 0;
      files.forEach(async function (file) {
        var a_name= file; 
        var a_path= url+ a_name;
        console.log(a_path);
        // query for submission table
        var query= "INSERT INTO `submission`(Aid,Cid,`a_name`,`a_path`) VALUES (?,?,?,?)";
        var params= [req.params.Aid, req.params.id, a_name, a_path];
        let result1 = await queryExecute(query ,params) ;
        console.log(`${a_name}  submission  inserted`);
        submissions.push({"Subid":result1.insertId, "Sid":dict[a_name.substr(0, a_name.lastIndexOf('.'))]});

        query             = "INSERT INTO `checks`(Subid,Sid,Tid) VALUES (?,?,?)";
        var params        = [result1.insertId, dict[a_name.substr(0, a_name.lastIndexOf('.'))], talist[(ta++)%talist.length]];
        let checksInsert  = await queryExecute(query ,params) ;
        
        console.log(`${params} in checks table inserted`);
      });
    });
  }

  // //TA submission relation----------------------------------------------------
  // function taChecks(submissions, talist) {
  //   return new Promise(function(resolve, reject) {
  //     var ta = 0;
  //     // query for checks table -----------add TID, SubID
  //     console.log("TA CHEKS");
  //     submissions.forEach(async function(data){
  //       var query         = "INSERT INTO `checks`(Subid,Sid,Tid) VALUES (?,?,?)";
  //       var Subid         = data.Subid;
  //       var Sid           = data.Sid;
  //       var Tid           = talist[ta];
  //       var params        = [Subid, Sid, Tid];
  //       let checksInsert  = await queryExecute(query ,params) ;
        
  //       console.log(`${params} in checks table inserted`);
  //       ta = (ta + 1) % talist.length;
  //     });
  //     resolve(true);
  //   })
  // }
  async function call() {
    res.redirect(`/courses/${req.params.id}/assignment/${req.params.Aid}`);
  }

  if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif"|| file.mimetype == "text/plain" ||  file.mimetype == "application/zip" )
  {
    file.mv('public/Assignments/'+file.name, function(err) {

      if (err)
        return res.status(500).send(err);
      async function func3(){
        console.log("func3");
        await unzip();
        setTimeout(storeinDB,3000);
        setTimeout(call,6000);
      }
      func3();
    });

  } 
  else{
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
