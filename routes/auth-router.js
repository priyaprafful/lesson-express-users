const express =require("express");

const router =express.Router();

const bcrypt = require ("bcrypt");

const passport= require("passport");



const User =require("../models/user-model.js");



router.get("/signup",(req,res,next)=>{
  res.render("auth-views/signup-forms.hbs");
});
router.post("/process-signup",(req,res,next)=>{
  const{fullName,email,originalPassword} = req.body;

  if (!originalPassword||originalPassword.match(/[0-9]/)===null){
    req.flash("error","password cant be blank and must contain a number")
    res.redirect("/signup")
    return;
  }


  //Ths is where we will check the pssword rules
//encrupt thesubmit password before saving
  const encryptedPassword = bcrypt.hashSync(originalPassword,10);



User.create({fullName,email,encryptedPassword})
.then(userDoc=>{
  req.flash("success","Signup success");
  res.redirect("/")
})
.catch(err =>next(err));

});

router.get("/login",(req,res,next)=>{
  //send flash messages to the hbs file as messages.
  res.locals.messages = req.flash();
 res.render("auth-views/login-forms.hbs")
});


router.post("/process-login",(req,res,next)=>{
  //res.send(req.body);
  const {email,originalPassword} =req.body;


  User.findOne({email:{$eq:email}})
  .then(userDoc => {
    if(!userDoc){
    //Here we will check if the email is wrong
    req.flash("error","incorrect email");
    res.redirect("/login");
    return;

  }

    //check the password
    const {encryptedPassword} = userDoc;
    //"CompareSync()" will return false if original password is wrong
    if(!bcrypt.compareSync(originalPassword,encryptedPassword)) {

      //redirect to the login page if the password is wrong
      //"req.flash()" is defined by "connect-flash"
      //(2 arguments:message type and message text)
      req.flash("error","Incorrect password");
      res.redirect("/login");
   // res.send(bcrypt.compareSync(originalPassword,encryptedPassword));
    }
    else{
      //""req.login()" is a passport  method that calls "serialization()";
      //that saves the user Id in the session
      req.logIn(userDoc,()=>{

      //req flash is defined by connect flash
      //(2 arguments:message type and message text)
      req.flash("success","Log in success! ");
      res.redirect("/")
    })
    }
  })
  .catch(err=>next(err));
});


router.get("/logout",(req,res,next)=>{
  //"req.logout()" is a passport method that removes the userId from session
  req.logOut();
  req.flash("success","logged out succesfully!");
  res.redirect("/")
});

//Visiting ""/google/logint, will be redireted to after accepting Google for logging in
router.get("/google/login",
passport.authenticate("google",{
  scope:[
    "https://www.googleapis.com/auth/plus.login",
    "https://www.googleapis.com/auth/plus.profile.emails.read",
  ]
}));


//this is where users will be redirected to after accepting Google login
router.get("/google/user-info",
passport.authenticate("google",{
  successRedirect:"/",
  successFlash:"Google-login succesful",
  failureRedirect:"/login",
  failureFlash:"Google login failed",
}));



module.exports = router;