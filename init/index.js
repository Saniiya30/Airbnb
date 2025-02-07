
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
 //ab yaha har data me manually owner add karne ki jagah humne data me init karwa diya onj ke through ussi ki id leke 
  initData.data= initData.data.map((obj)=>({...obj,owner:"67a6045ccb5ee40549f706ab"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
