const express= require("express");
const router= express.Router();


//INDEX
router.get("/",(req,res)=>{
    res.send("GET for post");
})
//SHOW
router.get("/:id",(req,res)=>{
    res.send("GET for show post");
})
//POST
router.post("/:id",(req,res)=>{
    res.send("POST for post");
})
//DELETE
router.delete("/:id",(req,res)=>{
    res.send("Delete for post id");
})

module.exports= router;