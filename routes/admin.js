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

})

adminRouter.post("/course",adminMiddleware,async function(req,res){
    const adminId=req.userId;
    
    const {title,description,imageUrl,price}=req.body;

        //TODO-Make option to upload img rather than URL
        const course=await courseModel.create({
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

adminRouter.put("/course",adminMiddleware,async function(req,res){
    const adminId=req.userId;
    
    const {title,description,imageUrl,price,courseId}=req.body;

        //TODO-Make option to upload img rather than URL
    const course=await courseModel.updateOne({
        _id:courseId,
        creatorId:adminId
    },{
        title:title,
        description:description,
        imageUrl:imageUrl,
        price:price
    })
    
    res.json({
        message:"Course Updated",
        courseId:course._id
    })
})

adminRouter.get("/course/bulk",adminMiddleware,async function(req,res){
    const adminId=req.userId;
    
    const courses=await courseModel.find({
        creatorId:adminId
    });
    
    res.json({
        message:"Your Course",
        courses
    })
})

module.exports={
    adminRouter:adminRouter
}