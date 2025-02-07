if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express=require("express");
const app= express();

const mongoose=require("mongoose");
const Listing= require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync= require("./util/wrapAsync.js");
const ExpressError= require("./util/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");

const Review= require("./models/review.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "public")));


const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");


main()
.then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(dbUrl);
}


const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in MONGO Session Store",err);
})

const sessionOptions={          // aise likh sakte hai taaki aur koi change karna ho toh yahi kar paaye 
    store,
    secret:process.env.SECRET,
    resave:false,
     saveUninitialized:true,
     cookie:{
        expires:Date.now()+7*24*60*60*1000,   // aaj se 7 din ke baad expire hinge just like github
        maxAge:7*24*60*60*1000,
        httpOnly:true,  // secure(cross scripting error ke liye )
     },
};
// app.get("/",(req,res)=>{
//     res.send("Hi I am root");
//     });

app.use(session(sessionOptions));
app.use(flash());

//passport bhi session ko use karega kyunki agar use ek hi broswer pe hai bas tab change kar raha hai tab usse wapas login/signup na karna pade
 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());  //user se related info ko store karwana is serialize 
passport.deserializeUser(User.deserializeUser()); //user se related info ko unstore karwana is deserialize

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;  //req.user ko ejs me direct acces n hi kar paate hai toh local middleware ke through access karenmge
    next(); //// next ko call karna mat bhoolna warna issi middleware pe stuck reh jaoge
});// iss flash ke baad index pe jayega kyuki listing pe redirect ho raha hai


//demo user to check the login/signup thing
// app.get("/demoUser",async(req,res)=>{
//     let user= new User({
//         email:"saniya@gmail.com",
//         username:"saniya"
//     });

//     let registerdUser= await User.register(user,"priyanshu30"); // register is a static method which store your user and its passsword
//     res.send(registerdUser);                                       // register also checks whether usernamw is unique or not
// })                                    


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);





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

