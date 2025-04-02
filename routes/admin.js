const {Router} = require("express");
const {adminModel, courseModel}=require("../db");
const jwt=require("jsonwebtoken");
const adminRouter=Router();
const {JWT_ADMIN_PASSWORD} =require("../config");
const {adminMiddleware} = require("../middleware/adminMiddleware");



adminRouter.post("/signup",async function(req,res){

    const {email,password,firstName,lastName}=req.body;
    
        //put inside this in try-catch block
        await adminModel.create({
            email:email,
            password:password,
            firstName:firstName,
            lastName:lastName
        })
        res.json({
            message:"admin Signup succeded"
        })

})

adminRouter.post("/signin",async function(req,res){

    const {email,password}=req.body;
    
        //TODO:Ideally pwd should be hashed and hence u cant compare the user provided password and tha database password
    
        const admin=await adminModel.findOne({
            email:email,
            password:password
        });
    
        if(admin){
            const token=jwt.sign({
                id:admin._id
            },JWT_ADMIN_PASSWORD);
    
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

    res.json({
        message:"Admin Signin Endpoint"
    })
})

adminRouter.post("/course",adminMiddleware,async function(req,res){
    const adminId=req.userId;
    
    const {title,description,imageUrl,price}=req.body;

        //TODO-Make option to upload img rather than URL
    await courseModel.create({
        title:title,
        description:description,
        imageUrl:imageUrl,
        price:price,
        creatorId:adminId
    })
    
    res.json({
        message:"Course Created",
        courseId:course._id
    })
})

adminRouter.put("/course",function(req,res){
    res.json({
        message:"Admin add Course Endpoint"
    })
})

adminRouter.get("/course/bulk",function(req,res){
    res.json({
        message:"Admin Bulk Course Endpoint"
    })
})

module.exports={
    adminRouter:adminRouter
}