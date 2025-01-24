const express= require("express");
const router=express.Router();
const Listing= require("../models/listing.js");
const wrapAsync= require("../util/wrapAsync.js");
const ExpressError= require("../util/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");

//INDEX ROUTE 

router.get("/",wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({})
       res.render("listings/index.ejs",{allListings});
      }));
     
       
   //NEW ROUTE
  router.get("/new",isLoggedIn,(req,res)=>{   // yaha isloggedin middle ware hai jon commebnt waali isauthenticated ko middle ware sum up karek yaha likha hai
    // if(!req.isAuthenticated()){
    //     req.flash("error","You must be logged in to add Listings");//ab se isAuthenticated har jagah hon chahiye (edit,delete)
    //     res.redirect("/login");                                   //toh uske liye har jagah copy karte ki jagah hum isse ek middleware me pass kar denge
    // }
      res.render("listings/new.ejs");
    });
  
  //SHOW ROUTE
 router.get("/:id",wrapAsync(async(req,res)=>{
     let {id}=req.params;
    const listing= await Listing.findById(id).populate({path:'reviews' , populate : {path:"author"}}).populate('owner');
      
      console.log(listing,id); 
    if(!listing){
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
    
    res.render("listings/show.ejs",{listing});
  }));
  //CREATE ROUTE
  router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
    
          // if(!req.body.listing){
          //     throw new ExpressError(404,"send valid data for listing");
          // }
          const newListing=new Listing(req.body.listing);
          console.log(newListing);
          newListing.owner=req.user._id;
          await newListing.save();
          req.flash("success","New Listing created");
          res.redirect("/listings");
  })
  );
  
  //EDIT ROUTE 
  router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
      let {id}=req.params;
      const listing= await Listing.findById(id);
      if(!listing){
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
      
      res.render("listings/edit.ejs", { listing });
  }));
  //Update route
  router.patch("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
      let {id}=req.params;
      
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      req.flash("success"," Listing Updated");
      res.redirect(`/listings/${id}`);
      
  }));
  //DELETE ROUTE
  router.delete("/:id", isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
      let {id}=req.params;
     let deletedListing= await Listing.findByIdAndDelete(id);
     req.flash("success","Listing Deleted");
     res.redirect("/listings");
  
  }));
  

  module.exports= router;