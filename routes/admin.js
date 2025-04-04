const {Router} = require("express");
const {adminModel, courseModel}=require("../db");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const adminRouter=Router();
const {JWT_ADMIN_PASSWORD} =require("../config");
const {adminMiddleware} = require("../middleware/adminMiddleware");
const {signupAdminSchema,signinAdminSchema}=require("../zod/inputValidation");


adminRouter.post("/signup",async function(req,res){

    try{
        const adminCheck=await signupAdminSchema.safeParseAsync(req.body);

        if(!adminCheck.success){
            return res.status(403).json({
                message:"Invalid Validation",
                error:adminCheck.error.issues
            })
        }

        const {email,password,firstName,lastName}=adminCheck.data;

        const hashedPassword = await bcrypt.hash(password, 10);
    
        //put inside this in try-catch block
        await adminModel.create({
            email:email,
            password:hashedPassword,
            firstName:firstName,
            lastName:lastName
        })
        res.json({
            message:"admin Signup succeded"
        })
    }
    catch(error){
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(409).json({ message: "Email already in use in db" });
          }

        console.error("Admin Signup error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
    

});

adminRouter.post("/signin",async function(req,res){

    try {

        const parsedAdmin=signinAdminSchema.safeParse(req.body);
        if(!parsedAdmin.success){
            return res.status(411).json({
                message:"Admin Parse Invalid",
                error:parsedAdmin.error.errors
            })
        }
        const { email, password } = parsedAdmin.data;

        //TODO:Ideally pwd should be hashed and hence u cant compare the user provided password and tha database password

        const admin = await adminModel.findOne({
            email: email
        });

        if(!admin){
            return res.status(411).json({
                message:"Admin not found with this email-ID"
            })
        }

        const passwordMatch=await bcrypt.compare(password,admin.password);

        if(!passwordMatch){
            return res.status(403).json({
                message:"Incorrect Credentials"
            })
        }
            const token = jwt.sign({
                id: admin._id
            }, JWT_ADMIN_PASSWORD);

            //Do Cookies logic here
            res.json({
                token: token
            })
        }
    catch(error){
        console.error("Signin error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    

});

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