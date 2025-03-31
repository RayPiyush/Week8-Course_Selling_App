const {Router} = require("express");

const adminRouter=Router();

adminRouter.post("/signup",function(req,res){
    res.json({
        message:"Admin Signup Endpoint"
    })
})

adminRouter.post("/signin",function(req,res){
    res.json({
        message:"Admin Signin Endpoint"
    })
})

adminRouter.post("/course",function(req,res){
    res.json({
        message:"Admin Course Endpoint"
    })
})

adminRouter.put("/add/course",function(req,res){
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