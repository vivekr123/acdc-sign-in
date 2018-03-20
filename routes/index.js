var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var mongoose = require('mongoose');



var app = express();

//app.locals.datesToRender = [];

//var datesToRender=[];


var url = 'mongodb://localhost/loginapp';

//Get Home page
router.get('/',ensureAuthenticated, function(req,res){

  var datesToRender = [];

  var db = mongoose.connection;

  console.log(req.user.username);

  console.log('Hi');
//  posts = url.collection('signInSheets');
  db.collection('signInSheets').find({name:req.user.username}).toArray(function(err,results){
    console.log(results);

  /*  var j = results.length-1;
    for(i = 0; i<results.length; i++){

      results[j] = results[i].date;
      console.log(j);
      j = j-1;
    } */

    var j = 0;
    for(i = 0; i<results.length; i++){

      datesToRender[j] = results[i].date;
      console.log(j);
      j++;

}
    console.log(datesToRender);



    res.render('index',{dates:datesToRender});

  /*  for(i=0; i<results.length;i++){
      datesToRender[i]=results[i].date
    } */
/*    i = 0;
    for(j=results.length-1; j>=0;j--){

      //datesToRender[i]=results[j].date
      app.locals.datesToRender[i]=results[j].date;
      i++;
    } */

  });

//console.log(app.locals.datesToRender);

//  res.render('index',{dates:datesToRender});
//res.render('index',{dates:app.locals.datesToRender});

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
