const express=require("express");

const app=express();

app.post("/user/signup",function(req,res){
    res.json({
        message:"Signup Endpoint"
    })
})

app.post("/user/signin",function(req,res){
    res.json({
        message:"Signin Endpoint"
    })
})


app.post("/user/purchases",function(req,res){
    res.json({
        message:"Purchase  endpoint"
    })
})

app.get("/course/purchase",function(req,res){
    res.json({
        message:"Purchase list endpoint"
    })
})

app.get("/courses",function(req,res){
    res.json({
        message:"Courses endpoint"
    })
})

app.listen(3000);