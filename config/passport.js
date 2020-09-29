// config/passport.js

// load up the user model
var mysql      = require('mysql');
var bcrypt     = require('bcrypt-nodejs');
var dbconfig   = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

//connection.connect();
connection.query('USE ' + dbconfig.database);

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup 
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log("SER SERIALIZXZZZE : "+JSON.stringify(user));
        // sending user obj
        userObj = {id:user.id, type: user.type};
        done(null, userObj);
    });

    // used to deserialize the user
    passport.deserializeUser(function(userObj, done) {
        // //connection.connect();\
        console.log("USER OBJ: "+JSON.stringify(userObj));
        if(userObj.type === "Professor"){
            connection.query("SELECT * FROM professor WHERE id = ? ",[userObj.id], function(err, rows){
                done(err, rows[0]);
            });
        }
        else if(userObj.type === "Asisstant"){
            connection.query("SELECT * FROM asisstant WHERE id = ? ",[userObj.id], function(err, rows){
                done(err, rows[0]);
            });
        }
        else{
            connection.query("SELECT * FROM student WHERE id = ? ",[userObj.id], function(err, rows){
                done(err, rows[0]);
            });
        }
    });

    // =========================================================================
    // LOCAL SIGNUP 
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password,  done) {
            let type = req.body.type;
            // console.log("REQ: "+JSON.stringify(req.body));
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            if(req.body.type === "Professor"){
                connection.query("SELECT * FROM professor WHERE username = ?",[username], function(err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null),
                            type: "Professor"
                        };
                        var insertQuery = "INSERT INTO professor( username, password, type ) values (?,?,?)";
                        connection.query(insertQuery,[newUserMysql.username, newUserMysql.password, newUserMysql.type],
                            function(err, rows) {
                                if(err){
                                    throw err;
                                }
                                else{
                                    console.log("NEWUSERMYSQL: "+ JSON.stringify(newUserMysql));
                                    newUserMysql.id = rows.insertId;
                                    return done(null, newUserMysql);
                                }
                        });
                    }
                });
            }
            else if(req.body.type === "Student"){
                connection.query("SELECT * FROM student WHERE username = ?",[username], function(err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null),
                            type: "Student"
                        };
                        var insertQuery = "INSERT INTO student( username, password, type ) values (?,?,?)";
                        connection.query(insertQuery,[newUserMysql.username, newUserMysql.password,  newUserMysql.type],
                            function(err, rows) {
                                if(err){
                                    throw err;
                                }
                                else{
                                    newUserMysql.id = rows.insertId;
                                    return done(null, newUserMysql);
                                }
                        });
                    }
                });
            }
            else if(req.body.type === "Asisstant"){
                connection.query("SELECT * FROM asisstant WHERE username = ?",[username], function(err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null),
                            type: "Asisstant"
                        };
                        var insertQuery = "INSERT INTO asisstant( username, password, type ) values (?,?,?)";
                        connection.query(insertQuery,[newUserMysql.username, newUserMysql.password, newUserMysql.type],
                            function(err, rows) {
                                if(err){
                                    throw err;
                                }
                                else{
                                    newUserMysql.id = rows.insertId;
                                    return done(null, newUserMysql);
                                }
                        });
                    }
                });
            }
        })
    );

    // =========================================================================
    // LOCAL LOGIN 
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            
            var type = req.body.type;
            var userFound = 0;

            async function profCheck() {
                return new Promise(function(resolve, reject) {
                    var table = "professor";
                    var sqlQuery = "SELECT * FROM "+table+" WHERE username = ?";
                    connection.query(sqlQuery,[username], function(err, rows){
                        var ret = null;
                        if (err){
                            console.log(err);
                            ret = done(err);
                        }
                        // if the user is found but the password is wrong
                        else if (rows.length && !bcrypt.compareSync(password, rows[0].password))
                            ret= done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                        else if(rows.length && bcrypt.compareSync(password, rows[0].password))
                        {userFound = 1;    ret= done(null, rows[0]);}
                        // all is well, return successful user
                    });
                    resolve(ret); // successfully fill promise
                })
            }
            async function asisstCheck() {
                return new Promise(function(resolve, reject) {
                    var table = "asisstant";
                    var sqlQuery = "SELECT * FROM "+table+" WHERE username = ?";
                    connection.query(sqlQuery,[username], function(err, rows){
                        var ret = null;
                        if (err){
                            console.log(err);
                            ret = done(err);
                        }
                        // if the user is found but the password is wrong
                        else if (rows.length && !bcrypt.compareSync(password, rows[0].password))
                            ret= done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                        else if(rows.length && bcrypt.compareSync(password, rows[0].password))
                        {userFound = 1;    ret= done(null, rows[0]);}
                        // all is well, return successful user
                    });
                    resolve(ret); // successfully fill promise
                })
            }
            async function studCheck() {
                return new Promise(function(resolve, reject) {
                    var table = "student";
                    var sqlQuery = "SELECT * FROM "+table+" WHERE username = ?";
                    connection.query(sqlQuery,[username], function(err, rows){
                        var ret = null;
                        if (err){
                            console.log(err);
                            ret = done(err);
                        }
                        // if the user is found but the password is wrong
                        else if (rows.length && !bcrypt.compareSync(password, rows[0].password))
                            ret= done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                        else if(rows.length && bcrypt.compareSync(password, rows[0].password))
                        {userFound = 1;    ret= done(null, rows[0]);}
                        // all is well, return successful user
                    });
                    resolve(ret); // successfully fill promise
                })
            }

            async function loginCheck() {
                ret = await profCheck();
                if(ret == null){
                    ret = await asisstCheck();
                    if(ret == null){
                        ret = await studCheck();
                        if(ret == null){
                            return done(null, false, req.flash('loginMessage', 'No user Found.')); // create the loginMessage and save it to session as flashdata
                        }
                        else{
                            return ret;
                        }
                    }
                    else{
                        return ret;
                    }
                }
                else{
                    return ret;
                }
            }

            return loginCheck();
            // var table = "professor";
            // var sqlQuery = "SELECT * FROM "+table+" WHERE username = ?";
            // var userFound = 0;
            // connection.query(sqlQuery,[username], function(err, rows){
            //     if (err)
            //     return done(err);
            //     // if the user is found but the password is wrong
            //     else if (rows.length && !bcrypt.compareSync(password, rows[0].password))
            //         return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            //     else if(rows.length && bcrypt.compareSync(password, rows[0].password))
            //     {userFound = 1;    return done(null, rows[0]);}
            //     // all is well, return successful user
            // });
            // table = "asisstant";
            // var sqlQuery = "SELECT * FROM "+table+" WHERE username = ?";
            // connection.query(sqlQuery,[username], function(err, rows){
            //     if (err)
            //     return done(err);
            //     // if the user is found but the password is wrong
            //     else if (rows.length && !bcrypt.compareSync(password, rows[0].password))
            //         return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            //     else if(rows.length && bcrypt.compareSync(password, rows[0].password))
            //     {userFound = 1;    return done(null, rows[0]);}
            //     // all is well, return successful user
            // });
            // table = "student";
            // var sqlQuery = "SELECT * FROM "+table+" WHERE username = ?";
            // connection.query(sqlQuery,[username], function(err, rows){
            //     if (err)
            //     return done(err);
                
            //     // if(!rows.length)
            //     //     return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            //     if (rows.length && !bcrypt.compareSync(password, rows[0].password))
            //         return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            //     else if(rows.length && bcrypt.compareSync(password, rows[0].password))
            //     {userFound = 1;    return done(null, rows[0]);}
            //         // all is well, return successful user
            //     });
            //     // if(userFound == 0)
            //     //     return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-fla
            //     // else
            //     //     return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-fla
        })
    );
};
// connection.end();
