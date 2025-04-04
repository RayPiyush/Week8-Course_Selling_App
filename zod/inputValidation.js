const zod=require("zod");
const {userModel, adminModel}=require("../db");

//SignUp Route for User
//if using .refine then must use safeParseAsync(req.body)
const signupUserSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    firstName: zod.string().min(1),
    lastName: zod.string().min(1),
 }).refine(async (data) => {
    const existingUser = await userModel.findOne({ email: data.email });
    return !existingUser;
  }, {
    message: "Email already in use",
    path: ["email"],
  });

//signinRoute of User
  const signinUserSchema=zod.object({
    email:zod.string().email(),
    password:zod.string().min(6,"Password must be at least 6 character")
  });


const signupAdminSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    firstName: zod.string().min(1),
    lastName: zod.string().min(1),
 }).refine(async (data) => {
    const existingUser = await adminModel.findOne({ email: data.email });
    return !existingUser;
  }, {
    message: "Email already in use",
    path: ["email"],
  });

  const signinAdminSchema=zod.object({
    email:zod.string().email(),
    password:zod.string().min(6,"Password must be at least 6 character")
  });

module.exports={
    signupUserSchema:signupUserSchema,
    signinUserSchema:signinUserSchema,
    signupAdminSchema:signupAdminSchema,
    signinAdminSchema:signinAdminSchema
}