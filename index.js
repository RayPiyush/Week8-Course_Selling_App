const express=require("express");

const app=express();

app.post("/users/signup",function(req,res){
    res.json({
        message:"Signup Endpoint"
    })
})

app.post("/users/signin",function(req,res){
    res.json({
        message:"Signin Endpoint"
    })
})


app.post("/users/purchase",function(req,res){
    res.json({
        message:"Purchase  endpoint"
    })
})

app.get("/users/purchases",function(req,res){
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