const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync= require("../util/wrapAsync.js");
const passport = require("passport");
const{saveRedirectUrl}=require("../middleware.js");
//signup page 
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
  try{
    let {username,email,password}=req.body;
    const newUser=new User({email, username});
  const registerdUser= await User.register(newUser,password);
  console.log(registerdUser);
  req.login(registerdUser,(err)=>{
    if(err){
     return next(err);                                    //hum ye req.login isliye kiye kyunki signup karne ke baad seedha user log in ho jaaye usse same details se login na karna pade
    }
    req.flash("success","Welcome to WanderLust!!");
    res.redirect("/listings");
  });
  // req.flash("success","You're all set! Thanks for registering.");
  // res.redirect("/listings");
    
  }
  catch(e){
      req.flash("error",e.message);
      res.redirect("/signup");
  }
})
);

//login page

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true}),
    async(req,res)=>{  //here passport.authenticate isliye rakha hai taaki pata chale ki user pehle se signed up hai ya nhi if not toh login karne se pehle usko sign up karna padega
     req.flash("success","Welcome back to WanderLust!!")                                                             // and in case failure hone pe wog redirect kar jaaye to the login page
      //res.redirect(res.locals.redirectUrl);    //ab yaha ye passport khud se delete kardega ye redirectUrl wala toh abhi ye undefined dikhayega toh isse locals ke through save karwa legha jo har jagah access kar paayenge aur phir passport usse delete bhi nahi kar paayega 
      
    let redirectUrl=res.locals.redirectUrl || "/listings";  // ab humne aise isliye likhna pada kyunki pehle waale tareeke se hum seedha login kare tab page not found aa raha tha kyunki isLoggedIn function trigger nhi ho raha tha since wih trigger nahi ho raha tha toh listings pr redirect nahi kar paa raha tha
      res.redirect(redirectUrl);
})                                            

//logout page
router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","Logged you out!!");
        res.redirect("/listings");
  });
});
module.exports= router;