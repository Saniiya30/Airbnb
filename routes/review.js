const express= require("express");
const router= express.Router({mergeParams: true});
const wrapAsync= require("../util/wrapAsync.js");
const ExpressError= require("../util/ExpressError.js");
 const {listingSchema,reviewSchema}=require("../schema.js");
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const{validateReview,isLoggedIn}= require("../middleware.js");


//REVIEWS
//POST REVIEW ROUTE
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
 
   await newReview.save();
   await listing.save();
 
 //   console.log("new rewviw saved");
 //   res.send("new review saved");
 req.flash("success","New Review created");
 res.redirect(`/listings/${listing._id}`);
 }));
 
 //DELETE REVIEW ROUTE
 router.delete("/:reviewId",wrapAsync(async(req,res)=>{
     let {id,reviewId}= req.params;
     await Listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review Deleted");
     res.redirect(`/listings/${id}`);
 
 }));

 module.exports= router;
 