const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name:{type:String, required:true},

  description:{
    type:String,
    required:true,
    minlength:100,

  },

  pictureUrl:{type:String,required:true},

  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },


},{
  timestamps:true,
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;