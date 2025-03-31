const {Router} = require("express");

const userRouter=Router();

userRouter.post("/signup",function(req,res){
    res.json({
        message:"Signup Endpoint"
    })
})

userRouter.post("/signin",function(req,res){
    res.json({
        message:"Signin Endpoint"
    })
})


userRouter.post("/purchases",function(req,res){
    res.json({
        message:"Purchase  endpoint"
    })
})

module.exports={
    userRouter:userRouter
}