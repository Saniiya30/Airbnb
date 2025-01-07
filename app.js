const express=require("express");
const app= express();

const mongoose=require("mongoose");
const Listing= require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync= require("./util/wrapAsync.js");
const ExpressError= require("./util/ExpressError.js");
const {listingSchema}=require("./schema.js")
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

const Review= require("./models/review.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "public")));


main()
.then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
res.send("Hi I am root");
});

const validateListing=(req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
//INDEX ROUTE 

app.get("/listings",wrapAsync(async (req,res)=>{
  const allListings= await Listing.find({})
     res.render("listings/index.ejs",{allListings});
    }));
    //NEW ROUTE

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
  });

//SHOW ROUTE
app.get("/listings/:id",wrapAsync(async(req,res)=>{
   let {id}=req.params;
  const listing= await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
}));
//CREATE ROUTE
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
  
        // if(!req.body.listing){
        //     throw new ExpressError(404,"send valid data for listing");
        // }
        const newListing=new Listing(req.body.listing);
        console.log(newListing);
        await newListing.save();
        res.redirect("/listings");
})
);

//EDIT ROUTE 
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);

    
    res.render("listings/edit.ejs", { listing });
}));
//Update route
app.patch("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});

    res.redirect(`/listings/${id}`);
    
}));
//DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
   let deletedListing= await Listing.findByIdAndDelete(id);
   res.redirect("/listings");

}));
//REVIEWS
//POST ROUTE
app.post("/listings/:id/reviews",async(req,res)=>{
   let listing=await Listing.findById(req.params.id);
   let newReview= new Review(req.body.review);
   listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

//   console.log("new rewviw saved");
//   res.send("new review saved");

res.redirect(`/listings/${listing._id}`);
});
//check listing

// app.get("/testListing",async (req,res)=>{
//     let sampleListing= new Listing({
//         title:"NEW HOME",
//         description:"Nice view in the morning",
//         price:1200,
//         location:"Nanda devi",
//         country:"INDIA",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("succesfull");
// })

//creating a route for the 404 page not found(if the developers route does not get matched with the above route then it automatically get matched with this route)

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!!!"));
});

/////this is to handle the next error through expresserror ejs thing
app.use((err,req,res,next)=>{
    let{statusCode,message}=err;
   res.status(statusCode).render("Error.ejs",{message});
    // res.status(statusCode).send({message});
});


app.listen("5500",()=>{
    console.log("server is running on port 5500");
});