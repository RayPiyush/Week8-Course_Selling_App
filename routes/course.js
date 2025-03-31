const {Router}=require("express");

const courseRoute=Router();


courseRoute.get("/purchase",function(req,res){
    res.json({
        message:"Purchase list endpoint"
    })
})

courseRoute.get("/preview",function(req,res){
    res.json({
        message:"Courses endpoint"
    })
})

module.exports={
    courseRoute:courseRoute
}