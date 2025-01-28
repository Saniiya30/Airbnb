const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync= require("../util/wrapAsync.js");
const passport = require("passport");
const{saveRedirectUrl}=require("../middleware.js");
const userController= require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm) // this is for signup form
.post(wrapAsync(userController.signup));//this is for the totake user detail and to make it save and then make the user logged in directly


router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
  passport.authenticate("local",{  //here passport.authenticate isliye rakha hai taaki pata chale ki user pehle se signed up hai ya nhi if not toh login karne se pehle usko sign up karna padega
     failureRedirect:"/login",     // and in case failure hone pe wog redirect kar jaaye to the login page
      failureFlash:true}),
       //res.redirect(res.locals.redirectUrl);    //ab yaha ye passport khud se delete kardega ye redirectUrl wala toh abhi ye undefined dikhayega toh isse locals ke through save karwa legha jo har jagah access kar paayenge aur phir passport usse delete bhi nahi kar paayega 
       userController.login
); 

//login page

                                       

//logout page
router.get("/logout",userController.logout);
module.exports= router;