const {Router} = require("express");
const {userModel, purchaseModel, courseModel}=require("../db");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const {JWT_USER_PASSWORD}=require("../config");
const {userMiddleware} = require("../middleware/userMiddleware");
const userRouter=Router();
const {signupUserSchema,signinUserSchema}=require("../zod/inputValidation");


userRouter.post("/signup",async function(req,res){
    //add zod validation here
    //use bCrypt to hash the password
    try{

        const result = await signupUserSchema.safeParseAsync(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues
            });
        }
        const {email,password,firstName,lastName}=result.data;

        // ✅ Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

    //put inside this in try-catch block
        await userModel.create({
            email:email,
            password:hashedPassword,
            firstName:firstName,
            lastName:lastName
        });
        res.json({
            message:"Signup succeded"
        });
    }
    catch (error) {

        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(409).json({ message: "Email already in use in db" });
          }

        console.error("Signup error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
    
});

userRouter.post("/signin",async function(req,res){

    

    //TODO:Ideally pwd should be hashed and hence u cant compare the user provided password and tha database password
    try{

        const parsed=signinUserSchema.safeParse(req.body);
        if(!parsed.success){
           return res.status(411).json({
                message:"validation failed",
                error:parsed.error.errors
            })
        }
    const {email,password}=parsed.data;


        const user=await userModel.findOne({
            email
        })
        if(!user){
            return res.status(403).json({
                message:"User Not Found"
            })
        }

        const passwordMatch=await bcrypt.compare(password,user.password);

        if(!passwordMatch){
            return res.status(403).json({
                message:"Incorrect Credentials"
            })
        }

        const token=jwt.sign({
            id:user._id
        },JWT_USER_PASSWORD);

        //Do Cookies logic here
        res.json({
            token:token
        })

    }
    catch(error){
        console.error("Signin error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



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