const express =require("express");

const router =express.Router();

const Room = require("../models/room-model.js")

router.get("/room/add",(req,res,next)=>{
  if(!req.user){
    req.flash("error","You have to be logged in to add a room")
    res.redirect("/login")
    return;//use return instead of big else
  }
  res.render("room-views/room-form.hbs")
});


router.post("/process-room",(req,res,next)=>{
  //res.send=req.body
  const {name,description,pictureUrl} = req.body;
  const owner= req.user._id;
  Room.create({name,description,pictureUrl,owner})
  .then(roomDoc=>{
    req.flash("success","Room created succesfully");
    res.redirect("/my-rooms")
  

  })
  .catch(err =>next(err));
});


router.get("/myrooms",(req,res,next) =>{

  if (!req.user){
    req.flash("error","You have to be logged in to add a room")
    res.redirect("/login")
    return;
  }
   Room.find({owner:{$eq:req.user._id}})
  .sort({createdAt:-1})
  .then(roomResults=>{
    res.locals.roomArray = roomResults;
    res.render("room-views/room-list.hbs");
  })
  .catch(err =>next(err));
});



















module.exports = router;