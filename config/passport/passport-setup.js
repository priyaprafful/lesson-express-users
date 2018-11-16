const passport = require ("passport");

const User = require("../../models/user-model.js")

//serializeUser(): defines what data to save in the sessions
passport.serializeUser((userDoc,done)=>{
  console.log("SERIALIZE (save userID to session");
  //call done () with null and the results if its successful
  //(The result is the user ID that we want to save in the sessin
  
  done(null,userDoc._id)

});

//deserializeUser(); defines how to retrieve the user information from the Db
//(happene automaticaly on every request After log in)
passport.deserializeUser((userId,done)=>{
  console.log("Deserialize(retriving user info from the DB)");
  User.findById(userId)
  .then(userDoc=>{
  //calldone() with null and the results if its sucessful
  //(the result is the user document from the database)
  done(null,userDoc);
})
  //call done() withthe error object if it fails
  .catch(err=>done(err));
});