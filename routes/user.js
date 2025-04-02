const {Router} = require("express");
const {userModel}=require("../db");
const jwt=require("jsonwebtoken");
const {JWT_USER_PASSWORD}=require("../config");
const userRouter=Router();

userRouter.post("/signup",async function(req,res){
    //add zod validation here
    //use bCrypt to hash the password
    const {email,password,firstName,lastName}=req.body;

    //put inside this in try-catch block
    await userModel.create({
        email:email,
        password:password,
        firstName:firstName,
        lastName:lastName
    })
    res.json({
        message:"Signup succeded"
    })
})

userRouter.post("/signin",async function(req,res){

    const {email,password}=req.body;

    //TODO:Ideally pwd should be hashed and hence u cant compare the user provided password and tha database password

    const user=await userModel.findOne({
        email:email,
        password:password
    });

    if(user){
        const token=jwt.sign({
            id:user._id
        },JWT_USER_PASSWORD);

        //Do Cookies logic here
        res.json({
            token:token
        })
    }
    else{
        res.status(403).json({
            message:"Incorrect Credentials"
        })
    }
    
})


userRouter.post("/purchases",function(req,res){
    res.json({
        message:"Purchase  endpoint"
    })
})

module.exports={
    userRouter:userRouter
}