const express=require("express");
const app= express();
const users= require("./routes/user.js");
const posts= require("./routes/post.js");
const session= require("express-session");
const flash= require("connect-flash");
const path= require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions={      // aise likh sakte hai taaki aur koi change karna ho toh yahi kar paaye 
    secret:"mysupersecretstring",
    resave:false,
     saveUninitialized:true,
};
app.use(session(sessionOptions));
app.use(flash());

app.get("/register",(req,res)=>{
    let {name="danger"}= req.query;
    req.session.name=name;   // yaha info ko store karwa liya hai 
    if(name =="danger"){
        req.flash("error","user not registered");
    }else{
        req.flash("success","user registered succesfully");
    }
    //req.flash("success","user registered succesfully");    // flash me key and msg ke pair me store honge but msg ko page pe dikahne ke liye views ka use karenge
    res.redirect("/hello")
});
app.get("/hello",(req,res)=>{
    //res.send(`Hello ${req.session.name}`);  // yaha info access karenge ek hi session me yaha pe req.session access se karenge jaise neeche req.count karenge
    //res.render("page.ejs",{name: req.session.name, msg:req.flash("success")}); // ab iss msg ko hi view.ejs me access karenge
   res.locals.successMsg=req.flash("success");
   res.locals.errorMsg=req.flash("error");    // ye hum re.local ka use kar rahe hai
   
    res.render("page.ejs",{name:req.session.name});
});





// app.use(session({secret:"mysupersecretstring",resave:false, saveUninitialized:true}));


// app.get("/reqcount",(req,res)=>{
//   if(  req.session.count){
//     req.session.count++;
//   }                              // ek hi browser me rhanege with differrent tabs phir bhi session counr same se se increase hoga
                                     //bur jaise hi mein edge pe gayio woth 1 se start hogva with different  session id
//   else{
//     req.session.count=1;
//   }
//     res.send(`you have requested ${req.session.count} times`);
// });
// app.get("/test",(req,res)=>{
//     res.send("test succresfull");
// });
//const cookieParser= require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed-cookies");
// });
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verifies");
   
// })
// app.get("/setcookies",(req,res)=>{
//     res.cookie("name","Saniya");
//     res.cookie("origin","India");
//     res.send("we sent you a cookie!!!!!");
// });
// app.get("/origin",(req,res)=>{
//     let{work="anonymous"}= req.cookies;
//     res.send(`hi, ${work}`);
// });
// app.get("/",(req,res)=>{
//     console.log(req.cookies);
//     res.send("I AM GROOT");
// });
// app.use("/users",users);
// app.use("/posts",posts);

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})