const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const User = require("../../models/user-model.js");

passport.use(new GoogleStrategy({
// settings object for the GoogleStrategy class
clientID:"569725431633-6ia9igq8ourii8jo1b39nr3o4he38qhs.apps.googleusercontent.com",
clientSecret:"HvdSeUQGog77GGnqaZJ6ufcF",
callbackURL:"/google/user-info",
proxy:true,//ned this for production version to work
},(accessToken,refreshToken,userInfo,done)=>{
//callback function that runs whenever a user accepts the google login
//(here we receive their information and decide how to save it)

console.log("Google user info-----------------",userInfo);
const {displayName,emails} = userInfo;

User.findOne({email:{$eq:emails[0].value}})
.then(userDoc=>{
  if(userDoc){
    done(null,userDoc);
    return;
  }
  User.create({fullName:displayName, email:emails[0].value}) 
.then(userDoc=>{
  //call done () with null and the results if its successful
  //(the result is the user document from the database)
  done(null,userDoc);
}) 
//call done() with the error object if it fails
.catch(err=>done(err))
})

.catch(err =>done(err));
}));

