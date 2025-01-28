const User= require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup= async(req,res)=>{
  try{
    let {username,email,password}=req.body;
    const newUser=new User({email, username});
  const registerdUser= await User.register(newUser,password);
  console.log(registerdUser);       
  req.login(registerdUser,(err)=>{                      //hum ye req.login isliye kiye kyunki signup karne ke baad seedha user log in ho jaaye usse same details se login na karna pade
    if(err){
     return next(err);                                                
    }
    req.flash("success","Welcome to WanderLust!!");
    res.redirect("/listings");
  });
  }
  catch(e){
      req.flash("error",e.message);
      res.redirect("/signup");
  }
};    

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

//login karwana toh pasport ka kamm hai yaha toh hum bas login ke bass ka msg print karwa rahe hai but for simplicity hum isee login hi bulayenge

module.exports.login=async(req,res)=>{ 
    req.flash("success","Welcome back to WanderLust!!") ;
    let redirectUrl=res.locals.redirectUrl || "/listings";  // ab humne aise isliye likhna pada kyunki pehle waale tareeke se hum seedha login kare tab page not found aa raha tha kyunki isLoggedIn function trigger nhi ho raha tha since wih trigger nahi ho raha tha toh listings pr redirect nahi kar paa raha tha
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
          if(err){
            return next(err);
          }
          req.flash("success","Logged you out!!");
          res.redirect("/listings");
    });
  };