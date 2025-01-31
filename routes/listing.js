const express= require("express");
const router=express.Router();
const Listing= require("../models/listing.js");
const wrapAsync= require("../util/wrapAsync.js");
const ExpressError= require("../util/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController= require("../controllers/listing.js");
const multer= require("multer");
const{storage}= require("../cloudConfig.js");
const upload=multer({storage});     //kisi ek folder me upload karwa lenge saari images ko



//yaha se saari main function utha ke controllers me daal diye hai
//router.route ka use karenge traaki jiska same route ho usko ek hi define karenge 
 router.route("/")
.get(wrapAsync(listingController.index))//(FOR INDEX)(yaha ka sara kaam ab controllers me hoga as a backend functionalty)
.post
 (isLoggedIn,
  upload.single("listing[image]"),validateListing,wrapAsync
  (listingController.createListing));//(CREATE ROUTE)


  //NEW ROUTE
  router.get("/new",isLoggedIn,listingController.renderNewForm);   // yaha isloggedin middle ware hai jon commebnt waali isauthenticated ko middle ware sum up karek yaha likha hai
    // if(!req.isAuthenticated()){
    //     req.flash("error","You must be logged in to add Listings");//ab se isAuthenticated har jagah hon chahiye (edit,delete)
    //     res.redirect("/login");                                   //toh uske liye har jagah copy karte ki jagah hum isse ek middleware me pass kar denge
    // }
    
    router.route("/:id")
    .get(wrapAsync(listingController.showListing))//SHOW ROUTE
    .patch(isLoggedIn,isOwner ,validateListing,wrapAsync(listingController.updateListing))//UPDATE ROUTE
    .delete( isLoggedIn,isOwner,wrapAsync(listingController.destoryListing));//DELETE ROUTE
  
  //EDIT ROUTE 
  router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
  

  module.exports= router;