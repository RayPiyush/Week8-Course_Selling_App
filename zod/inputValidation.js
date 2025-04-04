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

  const courseAdminSchema = zod.object({
    title: zod.string()
      .min(11, { message: "Title must be more than 10 characters" })
      .max(50, { message: "Title must be less than 50 characters" }),
  
    description: zod.string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(200, { message: "Description must be at most 200 characters" }),
  
    imageUrl: zod.string()
      .url({ message: "Must be a valid URL" })
      .regex(/\.(jpg|jpeg|png|webp)(\?.*)?$/i, { message: "Image must be .jpg, .jpeg, .png, or .webp" }),
  
    price: zod.number()
      .positive({ message: "Price must be a positive number" })
  });

module.exports={
    signupUserSchema:signupUserSchema,
    signinUserSchema:signinUserSchema,
    signupAdminSchema:signupAdminSchema,
    signinAdminSchema:signinAdminSchema,
    courseAdminSchema:courseAdminSchema
}