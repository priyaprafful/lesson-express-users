const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const userSchema = new Schema({
  //document structure and rules defined here
fullName :{
  type:String,
  required:true,
  minlength:2,
},
email:{
  type:String,
  required:true,
  unique:true,
  match:/^.+@.+\..+$/,
},
encryptedPassword:{type:String,},
role:{
  type:String,
  enum:["normal","admin"],
  required:true,
  default:"normal",
}
},{
  timestamps:true
});
//define the "isadmin" virtual property (it's really like a method)
//can't be an arrow function because it uses this
//(we use this to get around the limits on if conditions in HBS files)
userSchema.virtual("isAdmin").get(function(){
  return this.role==="admin";
});






const User = mongoose.model("User",userSchema);


module.exports = User;