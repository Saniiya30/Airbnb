const express= require("express");
const router= express.Router({mergeParams: true});
const wrapAsync= require("../util/wrapAsync.js");
const ExpressError= require("../util/ExpressError.js");
 const {listingSchema,reviewSchema}=require("../schema.js");
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const{validateReview,isLoggedIn,isReviewauthor}= require("../middleware.js");

const reviewController= require("../controllers/review.js");

//REVIEWS(main portion humne controller folder ke review file me likha hai)
//POST REVIEW ROUTE
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
 
 //DELETE REVIEW ROUTE
 router.delete("/:reviewId",isLoggedIn,isReviewauthor,wrapAsync(reviewController.destoryReview));

 module.exports= router;
 