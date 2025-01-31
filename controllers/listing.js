//yaha pe hum saari backend ki functionality likhenge  and ye saba uthaya gaya hai from models listsing.js se

const Listing= require("../models/listing");

module.exports.index=async (req,res)=>{
    const allListings= await Listing.find({})
       res.render("listings/index.ejs",{allListings});
      };

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing= async(req,res)=>{
    let {id}=req.params;
   const listing= await Listing.findById(id).populate({path:'reviews' , populate : {path:"author"}}).populate('owner');
     
     console.log(listing,id); 
   if(!listing){
       req.flash("error","Listing not found");
       res.redirect("/listings");
   }
   
   res.render("listings/show.ejs",{listing});
 };

 module.exports.createListing=async(req,res,next)=>{ 
    let url=req.file.path;
    let filename=req.file.filename;
  
    const newListing=new Listing(req.body.listing);
    
    newListing.owner=req.user._id;
    newListing.image={
        url,
        filename,
    };
    await newListing.save();
    req.flash("success","New Listing created");
    res.redirect("/listings");
 };

 module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing not found");
      res.redirect("/listings");
  }
    // let  OriginalImageUrl=listing.image.url;
    // OriginalImageUrl=OriginalImageUrl.replace("/upload","/upload/h_300,w_250,c_fill");
    res.render("listings/edit.ejs", { listing});
};

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing}); // yaha iamge ko chhodke sab edit hoga
    if(typeof req.file!="undefined"){
        let url=req.file.path;       //maan lete hai iamge me koi nayi iamge nahi daali toh khali backend ke pass jayefa
      let filename=req.file.filename; // uss case me undefined value aayegi
    listing.image={url,filename};    //toh if condtion check kar rahi hai ki agar koi file req ke andar exists karti hai tabki andar ka code chalega
    await listing.save();              //file exist nahi karti toh undefined aayegaa uat javascript me ye implement karne ke liye hum typeOf use karte hai
    }
    req.flash("success"," Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destoryListing=async(req,res)=>{
    let {id}=req.params;
   let deletedListing= await Listing.findByIdAndDelete(id);
   req.flash("success","Listing Deleted");
   res.redirect("/listings");
};