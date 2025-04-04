const zod=require("zod");
const {userModel}=require("../db");

const signupUserSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    firstName: zod.string().min(1),
    lastName: zod.string().min(1),
 });
// .refine(async (data) => {
//     const existingUser = await userModel.findOne({ email: data.email });
//     return !existingUser;
//   }, {
//     message: "Email already in use",
//     path: ["email"],
//   });

module.exports={
    signupUserSchema:signupUserSchema
}