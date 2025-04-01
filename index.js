require('dotenv').config();
const express=require("express");
const mongoose=require("mongoose");

const {userRouter}=require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

//console.log('MongoDB URI:', process.env.MONGO_URL);
const mongoURL = process.env.MONGO_URL;

const app=express();
app.use(express.json());


app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/course",courseRouter);

async function main(){
    //dotenv
    await mongoose.connect(mongoURL);
    app.listen(3000);
    console.log("Listening on port 3000");
}

main();



