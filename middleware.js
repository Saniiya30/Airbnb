const Listing = require("./models/listing");
const ExpressError= require("./util/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
       //redirect url information ko save karwana hai  tabhi karwana hai jab user loggin in nahi hai
       req.session.redirectUrl=req.originalUrl;
           req.flash("error","You must be logged in to add Listings");
          res.redirect("/login");                              //just to check if already logged in tabhi add edit delete listing kar payega otherwise pehle loggen in karado
       }
       next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{  // ab yaha as a middleware pass kar diya local kw through toh passport delete nhi kar paayega and local ko har jagah acceess kar sakte hai 
       if(req.session.redirectUrl){
              res.locals.redirectUrl=req.session.redirectUrl;
       }
       next();
};

module.exports.isOwner = async(req,res,next)=>{
       let {id}=req.params;
       let listing = await Listing.findById(id);
      if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listings"); // iss poori condition ko edit and delete ke liye baaar baar likhne se better hai ki iska bhi middleware bana de
       return res.redirect(`/listings/${id}`);
      }
      next();
}

module.exports.validateListing=(req,res,next)=>{
       let {error} =listingSchema.validate(req.body);
       
       if(error){
           let errMsg=error.details.map((el)=>el.message).join(",")
           throw new ExpressError(400,errMsg);
       }else{
           next();
       }
   };
   module.exports. validateReview=(req,res,next)=>{
       let {error} =reviewSchema.validate(req.body);
       
       if(error){
           let errMsg=error.details.map((el)=>el.message).join(",")
           throw new ExpressError(400,errMsg);
       }else{
           next();
       }
   };