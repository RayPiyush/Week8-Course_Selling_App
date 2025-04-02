const {Router} = require("express");
const {userModel, purchaseModel, courseModel}=require("../db");
const jwt=require("jsonwebtoken");
const {JWT_USER_PASSWORD}=require("../config");
const {userMiddleware} = require("../middleware/userMiddleware");
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


userRouter.get("/purchases",userMiddleware,async function(req,res){
    const userId=req.userId;

    const purchases=await purchaseModel.find({
        userId,
    })


    // let purchaseCourseIds=[];

    // for(let i=0;i<purchases.length;i++){
    //     purchaseCourseIds.push(purchases[i].courseId);
    // }

    //map is doing the above 4 line codes in 1 line
    const courseData=await courseModel.find({
        _id:{$in:purchases.map(x=>x.courseId)}
    })

    res.json({
        purchases,
        courseData
    })
})

module.exports={
    userRouter:userRouter
}