const express= require("express");
const router= express.Router();



//INDEX
router.get("/",(req,res)=>{
    res.send("GET for users");
})
//SHOW
router.get("/:id",(req,res)=>{
    res.send("GET for show users");
})
//POST
router.post("/:id",(req,res)=>{
    res.send("POST for users");
})
//DELETE
router.delete("/:id",(req,res)=>{
    res.send("Delete for users id");
})


module.exports= router;
