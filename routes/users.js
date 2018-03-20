var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost/loginapp';

var PDF = require('pdfkit');
var fs = require('fs');
var pdfMake = require('pdfmake');

//var jsPDF = require('jspdf');

var mongoose = require('mongoose');
db = mongoose.connection;

var errMessage;

var User = require('../model/user')

//Get Register page
router.get('/register',function(req,res){
  res.render('register');
});

// Login

router.get('/login',function(req,res){
  res.render('login');
});

//To register user

router.post('/register', function(req,res){

  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  //Validation
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('username','Username is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

//var for if there are validation errors
  var errors = req.validationErrors();

//to return error messages

  if(errors){
    res.render('register', {
      errors:errors
    })
  } else{
    var newUser = new User({                          //coming from the model created - user.js

      name:name,
      email:email,
      username:username,
      password:password

    });

    User.createUser(newUser, function(err, user){              //createUser function from user model
      if(err) throw err;
      console.log(user);

    });

    req.flash('success_msg', "You are registered. Please login")

    res.redirect('/users/login');                              //when succeeded, redirects to login page

  }

});


passport.use(new LocalStrategy(
  function(username, password, done) {

    User.getUserByUsername(username, function(err, user){            //username in input field
      if(err) throw err;
      if(!user){
                                                            //if not user in db
        return done(null, false, {message: 'Unknown User'});
      }

      User.comparePassword(password, user.password, function(err, isMatch){   //password in input field, and user's actual password
        if(err) throw err;
        if(isMatch){
          return done (null, user);
        } else {
          console.log('Hi');
          router.post('/login', function(req,res){
            console.log('Hi 2');
            res.render('login', {errMessage:'Hi there'});
          });

          return done(null, false, {message: 'Invalid password'});
        }
      });
                                                                              //getUserByUsername() and comparePassword() are in user model
    });
  }
));

//using cookies for sessions for user (easier)

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

//authenticating and redirecting accordingly

router.post('/login', passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),

function(req, res){

    res.redirect('/');


});

router.get('/', function(req,res){

      console.log('Hi');
      posts = url.collection('signInSheets');
      posts.find({name:req.user.username}).toArray(function(err,results){
        console.log(results);
      });

});

router.get('/logout', function(req,res){

  req.logout();                                                                    //logouts the user
  req.flash('success_msg', 'You have successfully logged out');                    //message showing logout
  res.redirect('/users/login');

/*  req.session.destroy(function(err){

    res.redirect('/users/login');

  });   */

});

/*router.get('/', function(req,res){                                       //Dashboard content for individual user

  console.log('Hi')
  posts = url.collection('signInSheets')
  posts.find({name:'john'}).toArray(function(err,results){
    console.log(results);
  });

}); */



router.get('/createSignIn',ensureAuthenticated, function(req,res){

  res.render('signInSheet');

});

router.get('/accessPDF', ensureAuthenticated, function(req,res){

    var query = req.query.date;

    //CHANGE THIS QUERY TO WORK

    //var query = hi;


  //  console.log(query);

  //Find object containing this date and put into html. Convert html to pdf.

    var objectToConvert = {};



    //db.collection('signInSheets').find({name:req.user.username,"date":query}).toArray(function(err, result){
    db.collection('signInSheets').find({date:query}).toArray(function(err, result){
    //  console.log(result[0]);

      result = result[0];

      console.log(result);

    //  var newText = "";
    //  newText = result.notes;



    doc = new PDF();

    //doc.text(newText, {align:'center', continued:true });

    //doc.pipe(fs.createWriteStream('test.pdf'));


  for(i=0; i<result.names.length; i++){

    var newText = "";

      newText = result.names[i];
      doc.text(newText, {align:'left', continued:true });

      newText = result.grades[i];
      doc.text(newText, {align:'center', continued:true});

      newText = result.emails[i];
      doc.text(newText, {align:'right'});

  }

    doc.end();


    res.setHeader('Content-type', 'application/pdf');
    return doc.pipe(res);





      //doc.save('Test.pdf');

    });



//ENDING - res.render('pdf');


});

          //add object containing all info into database under user's namespace

router.post('/createSignIn', function(req,res){             //use arraylists to hold the names, grades etc.

  var namesList=req.body.Name;
  var gradesList = req.body.Grade;
  var emailList = req.body.Email;
  console.log(namesList);
  console.log(gradesList);
  console.log(emailList);
  var d = new Date();
  var date =(d.getMonth()+1)+" / "+d.getDate()+" / "+d.getFullYear() + " - " + d.getHours() + " : " + d.getMinutes();

console.log(req.user.username);
//Adding arrayLists to database under current user

var insertDocument = function(db, callback){
  db.collection('signInSheets').insertOne({

    "date":date,
    "name":req.user.username,
    "names" : namesList,
    "grades" : gradesList,
    "emails" : emailList,
    function(err, result){
      assert.equal(err, null);
      console.log("Inserted Sign In Sheet into signInSheets");
      callback();
  }

})
};

MongoClient.connect(url, function(err, db){
  assert.equal(null, err);
  insertDocument(db, function(){
    db.close();
  });
});

res.redirect('/');
/*
  var notes = req.body.notes;

var insertDocument = function(db, callback){
  db.collection('signInSheets').insertOne({



    "notes":notes,
    "name":req.user.username,

    function(err, result){
      assert.equal(err, null);
      console.log("Inserted Sign In Sheet into signInSheets");
      callback();
  }

})
};

MongoClient.connect(url, function(err, db){
  assert.equal(null, err);
  insertDocument(db, function(){
    db.close();
  });
});

res.redirect('/');
*/

});

function ensureAuthenticated(req,res,next){

  if(req.isAuthenticated()){
    return next();
  }
  else{
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }

}

module.exports = router;
