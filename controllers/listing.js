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
    
    res.render("listings/edit.ejs", {listing});

};

// module.exports.updateListing=async (req,res)=>{
//     let {id}=req.params;
    
//     await Listing.findByIdAndUpdate(id,{...req.body.listing}); // yaha image ko chhodke sab edit hoga
//     req.flash("success"," Listing Updated");
//     res.redirect(`/listings/${id}`);
// };
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  console.log(req.body); // Debugging: check what data is coming in

  const listing = await Listing.findById(id);
  if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
  }

  // Update text fields
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // Handle image update if a new file is uploaded
  if (typeof req.file!="undefined") {
      listing.image = { url: req.file.path, filename: req.file.filename };
      await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};


module.exports.destoryListing=async(req,res)=>{
    let {id}=req.params;
   let deletedListing= await Listing.findByIdAndDelete(id);
   req.flash("success","Listing Deleted");
   res.redirect("/listings");
};