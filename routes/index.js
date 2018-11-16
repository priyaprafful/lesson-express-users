const express = require('express');

const User = require("../models/user-model.js")
const router  = express.Router();


/* GET home page */
router.get('/', (req, res, next) => {
  if(req.user){
    console.log("LOGGED IN", req.user);
  }
  else{
    console.log("Not logged in",req.user);
  }


  res.render('index');
});

router.get("/settings",(req,res,next)=>{
  if(!req.user){
    req.flash("error","You have to be logged in to visit User-settings");
    res.redirect("/login")
  }
  else{
    res.render("setting-page.hbs")
  }
 
  
})

router.post("/process-settings",(req,res,next)=>{
  //res.send(req.body);
  //Authorizations you have to be loggedin to visit this page
 
  const {fullName,email} = req.body;
  User.findByIdAndUpdate(
    req.user._id,//the logged in users id from the passports req.user
    {$set:{}},
    {runValidators:true},
  )
  .then(userDoc=>{
    req.flash("sucess","settings saved");
    res.redirect("/")
  })
  .catch(err =>next(err));
});

module.exports = router;


